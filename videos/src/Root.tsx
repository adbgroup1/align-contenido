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
    </Folder>
  );
};
