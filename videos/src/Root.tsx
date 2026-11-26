import { Composition, Folder } from "remotion";
import { InteresCompuesto } from "./InteresCompuesto";
import { W4702 } from "./videos/W47-02";
import { W4703 } from "./videos/W47-03";
import { W4704 } from "./videos/W47-04";
import { EXTRA_W4702, W4702v2 } from "./videos/W47-02-v2";
import { EJColchon, EXTRA_EJCOLCHON } from "./videos/EJ-colchon";
import { EXTRA_W4703, W4703v2 } from "./videos/W47-03-v2";
import { EXTRA_W4704, W4704v2 } from "./videos/W47-04-v2";
import { EXTRA_W4701, W4701v2 } from "./videos/W47-01-v2";
import { EXTRA_W4801, W4801 } from "./videos/W48-01";
import { EXTRA_W4802, W4802 } from "./videos/W48-02";
import { EXTRA_W4803, W4803 } from "./videos/W48-03";
import { EXTRA_W4804, W4804 } from "./videos/W48-04";
import { EXTRA_W4805, W4805 } from "./videos/W48-05";
import { EXTRA_W4901, W4901 } from "./videos/W49-01";
import { EXTRA_W4903, W4903 } from "./videos/W49-03";
import { EXTRA_W4906, W4906 } from "./videos/W49-06";
import { EXTRA_W4902, W4902 } from "./videos/W49-02";
import { EXTRA_W4904, W4904 } from "./videos/W49-04";
import { EXTRA_W4801v2, W4801v2 } from "./videos/W48-01-v2";
import { EXTRA_W4907, W4907 } from "./videos/W49-07";
import { EXTRA_W4908, W4908 } from "./videos/W49-08";
import { EXTRA_W4909, W4909 } from "./videos/W49-09";
import { EXTRA_W4917, W4917 } from "./videos/W49-17";
import { LAMINAS_W4911, W4911 } from "./videos/W49-11";
import { EXTRA_W4913, W4913 } from "./videos/W49-13";
import { EXTRA_W4915, W4915 } from "./videos/W49-15";
import { EXTRA_W4914, W4914 } from "./videos/W49-14";
import { EXTRA_W4912, W4912 } from "./videos/W49-12";
import { EXTRA_W4916, W4916 } from "./videos/W49-16";
import { EXTRA_W4919, W4919 } from "./videos/W49-19";
import { EXTRA_W4920, W4920 } from "./videos/W49-20";
import { EXTRA_W4921, W4921 } from "./videos/W49-21";
import { EXTRA_W4922, W4922 } from "./videos/W49-22";
import { EXTRA_W4923, W4923 } from "./videos/W49-23";
import { metadataConVoz } from "./kit";

// 3+7+7+4+5 s a 30 fps = 780 frames, menos 4 transiciones de 12 = 732
export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Reels">
      <Composition
        id="InteresCompuesto"
        component={InteresCompuesto}
        durationInFrames={732}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition id="W47-02" component={W4702} durationInFrames={960} fps={30} width={1080} height={1920} />
      <Composition id="W47-03" component={W4703} durationInFrames={900} fps={30} width={1080} height={1920} />
      <Composition id="W47-04" component={W4704} durationInFrames={990} fps={30} width={1080} height={1920} />
      {/* Kit v2: la duración sale de la voz (public/voz/<ID>/voz.json) */}
      <Composition
        id="W47-02-v2"
        component={W4702v2}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W47-02", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4702)}
      />
      {/* Ejemplo del método «imágenes generadas + kit» (videos/KIT.md, «Imágenes generadas») */}
      <Composition
        id="EJ-colchon"
        component={EJColchon}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "EJ-colchon", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_EJCOLCHON)}
      />
      <Composition
        id="W47-01-v2"
        component={W4701v2}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W47-01", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4701)}
      />
      <Composition
        id="W47-03-v2"
        component={W4703v2}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W47-03", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4703)}
      />
      <Composition
        id="W47-04-v2"
        component={W4704v2}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W47-04", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4704)}
      />
      <Composition
        id="W48-01"
        component={W4801}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W48-01", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4801)}
      />
      <Composition
        id="W48-01-v2"
        component={W4801v2}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W48-01-v2", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4801v2)}
      />
      <Composition
        id="W48-02"
        component={W4802}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W48-02", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4802)}
      />
      <Composition
        id="W48-03"
        component={W4803}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W48-03", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4803)}
      />
      <Composition
        id="W48-04"
        component={W4804}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W48-04", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4804)}
      />
      <Composition
        id="W48-05"
        component={W4805}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W48-05", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4805)}
      />
      <Composition
        id="W49-01"
        component={W4901}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-01", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4901)}
      />
      <Composition
        id="W49-03"
        component={W4903}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-03", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4903)}
      />
      <Composition
        id="W49-06"
        component={W4906}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-06", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4906)}
      />
      <Composition
        id="W49-02"
        component={W4902}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-02", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4902)}
      />
      <Composition
        id="W49-04"
        component={W4904}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-04", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4904)}
      />
      <Composition
        id="W49-07"
        component={W4907}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-07", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4907)}
      />
      <Composition
        id="W49-08"
        component={W4908}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-08", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4908)}
      />
      <Composition
        id="W49-09"
        component={W4909}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-09", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4909)}
      />
      <Composition
        id="W49-19"
        component={W4919}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-19", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4919)}
      />
      <Composition
        id="W49-20"
        component={W4920}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-20", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4920)}
      />
      <Composition
        id="W49-21"
        component={W4921}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-21", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4921)}
      />
      <Composition
        id="W49-22"
        component={W4922}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-22", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4922)}
      />
      <Composition
        id="W49-23"
        component={W4923}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-23", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4923)}
      />
      <Composition
        id="W49-17"
        component={W4917}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-17", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4917)}
      />
      <Composition
        id="W49-13"
        component={W4913}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-13", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4913)}
      />
      <Composition
        id="W49-15"
        component={W4915}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-15", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4915)}
      />
      <Composition
        id="W49-14"
        component={W4914}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-14", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4914)}
      />
      <Composition
        id="W49-12"
        component={W4912}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-12", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4912)}
      />
      <Composition
        id="W49-16"
        component={W4916}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoId: "W49-16", voz: null }}
        calculateMetadata={metadataConVoz(EXTRA_W4916)}
      />
      <Composition id="W49-11" component={W4911} durationInFrames={LAMINAS_W4911} fps={30} width={1080} height={1350} />
    </Folder>
  );
};
