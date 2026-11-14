import { Composition, Folder } from "remotion";
import { InteresCompuesto } from "./InteresCompuesto";

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
    </Folder>
  );
};
