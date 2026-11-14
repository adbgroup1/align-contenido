import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { fontFamily } from "./brand";
import { Chart, Counter, Cta, Hook, Insight } from "./Scenes";

export const InteresCompuesto = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: "#0F172A" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Gancho" durationInFrames={3 * fps}>
          <Hook
            style={{
              backgroundColor: "#0F172A",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence name="Contador" durationInFrames={7 * fps}>
          <Counter
            style={{
              backgroundColor: "#0F172A",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence name="Gráfico" durationInFrames={7 * fps}>
          <Chart style={{ backgroundColor: "#0B1224", flexDirection: "column" }} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence name="Idea clave" durationInFrames={4 * fps}>
          <Insight
            style={{
              backgroundColor: "#1D4ED8",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence name="CTA" durationInFrames={5 * fps}>
          <Cta
            style={{
              backgroundColor: "#F7F9FC",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
