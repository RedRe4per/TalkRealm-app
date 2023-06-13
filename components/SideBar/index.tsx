import ChannelBar from "./ChannelBar";
import TitleBar from "./TitleBar";
import FunctionBar from "./FunctionBar";

interface Props {
  muted: boolean;
  setMuted: (param: boolean) => void;
  camera: boolean;
  setCamera: (param: boolean) => void;
  shareScreen: boolean;
  setShareScreen: (param: boolean) => void;
  startScreenShare: () => void;
  stopScreenShare: () => void;
}

export default function SideBar({
  muted,
  setMuted,
  camera,
  setCamera,
  shareScreen,
  setShareScreen,
  startScreenShare,
  stopScreenShare,
}: Props) {
  return (
    <section className="max-w-[240px] h-[92.7vh] relative scrollbar-sidebar flex grow flex-col gap-y-5 overflow-y-auto border-r border-primary-100 bg-primary">
      <TitleBar />
      <ChannelBar />
      <FunctionBar
        muted={muted}
        setMuted={setMuted}
        camera={camera}
        setCamera={setCamera}
        shareScreen={shareScreen}
        setShareScreen={setShareScreen}
        startScreenShare={startScreenShare}
        stopScreenShare={stopScreenShare}
      />
    </section>
  );
}
