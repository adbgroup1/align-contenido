#!/bin/bash
# Efectos extra sintetizados con ffmpeg (propios, sin derechos de autor): trompetas de mariachi, bombo,
# sirena, pitido de monitor, rebobinado, acorde, claxon, rayón de disco y una cumbia de 2 s.
#   bash scripts/sfx-extra.sh        (desde videos/; deja los .wav en public/sfx/extra/)
set -e
OUT=public/sfx/extra; mkdir -p $OUT; T=$(mktemp -d); A="-loglevel error -y"
N="-ar 44100 -ac 1"
tr(){ f=$1; d=$2; echo "(sin(2*PI*$f*t+0.3*sin(2*PI*6*t))+0.7*sin(4*PI*$f*t)+0.5*sin(6*PI*$f*t)+0.35*sin(8*PI*$f*t)+0.25*sin(10*PI*$f*t)+0.15*sin(12*PI*$f*t))*min(1,t*25)*min(1,($d-t)*12)"; }
i=0; for nd in "523.25 0.16" "659.25 0.16" "783.99 0.16" "1046.5 0.7"; do set -- $nd; i=$((i+1)); ffmpeg $A -f lavfi -i "aevalsrc='0.18*$(tr $1 $2)':d=$2:s=44100" $T/n$i.wav; done
ffmpeg $A -i $T/n1.wav -i $T/n2.wav -i $T/n3.wav -i $T/n4.wav -filter_complex "[0][1][2][3]concat=n=4:v=0:a=1,asplit[a][b];[b]adelay=12,volume=0.7[c];[a][c]amix=inputs=2:normalize=0,aecho=0.6:0.5:60:0.3,highpass=f=200,loudnorm=I=-16" $N $OUT/trompetas.wav
ffmpeg $A -f lavfi -i "aevalsrc='0.9*sin(2*PI*(45+90*exp(-t*18))*t)*exp(-t*4)':d=1.2:s=44100" -af "loudnorm=I=-14" $N $OUT/bombo.wav
ffmpeg $A -f lavfi -i "aevalsrc='0.4*sin(2*PI*700*t-62.5*cos(2*PI*4*t))*min(1,t*20)*min(1,(0.9-t)*10)':d=0.9:s=44100" -af "loudnorm=I=-18" $N $OUT/sirena.wav
ffmpeg $A -f lavfi -i "aevalsrc='0.35*sin(2*PI*1000*t)*min(1,t*40)':d=2.2:s=44100" -af "loudnorm=I=-20" $N $OUT/plano.wav
ffmpeg $A -f lavfi -i "aevalsrc='0.35*sin(2*PI*1000*t)*min(1,t*60)*min(1,(0.12-t)*60)':d=0.12:s=44100" $N $OUT/bip.wav
ffmpeg $A -f lavfi -i "aevalsrc='0.3*sin(2*PI*(300*t+900*t*t))*(0.6+0.4*sin(2*PI*40*t))+0.08*(random(0)-0.5)':d=1.0:s=44100" -af "bandpass=f=1500:w=1800,loudnorm=I=-18" $N $OUT/rebobina.wav
ffmpeg $A -f lavfi -i "aevalsrc='0.12*(sin(2*PI*523.25*t)+sin(2*PI*659.25*t)+sin(2*PI*783.99*t)+0.7*sin(2*PI*987.77*t)+0.5*sin(2*PI*1046.5*t))*exp(-t*1.4)*min(1,t*30)':d=2.4:s=44100" -af "aecho=0.7:0.6:120:0.35,loudnorm=I=-17" $N $OUT/acorde.wav
ffmpeg $A -f lavfi -i "aevalsrc='0.25*(sgn(sin(2*PI*370*t))+sgn(sin(2*PI*466*t)))*(lt(t,0.18)+between(t,0.26,0.5))*0.5 + 0.3*sin(2*PI*(60+120*max(0,t-0.55))*t)*gt(t,0.55)*(0.5+0.5*sin(2*PI*25*t))':d=1.3:s=44100" -af "lowpass=f=3000,loudnorm=I=-17" $N $OUT/claxon.wav
ffmpeg $A -f lavfi -i "aevalsrc='0.5*(random(0)-0.5)*exp(-t*6)':d=0.45:s=44100" -af "bandpass=f=2200:w=2000,vibrato=f=12:d=1,loudnorm=I=-16" $N $OUT/rayon.wav
ffmpeg $A -f lavfi -i "aevalsrc='0.5*sin(2*PI*(if(lt(mod(t,1),0.5),98,147))*t)*exp(-mod(t,0.25)*8) + 0.15*(random(0)-0.5)*gt(mod(t*4,1),0.5)*(0.5+0.5*sin(2*PI*90*t)) + 0.2*sin(2*PI*800*t)*exp(-mod(t+0.125,0.25)*30)':d=2.2:s=44100" -af "loudnorm=I=-16" $N $OUT/cumbia.wav
rm -rf $T; ls $OUT
