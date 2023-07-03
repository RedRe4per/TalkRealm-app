import ChannelBar from "./ChannelBar";
import TitleBar from "./TitleBar";
import FunctionBar from "./FunctionBar";
import { UserObj } from "@/interfaces/socket";

interface Props {
  voice: boolean;
  setVoice: (param: boolean) => void;
  camera: boolean;
  setCamera: (param: boolean) => void;
  shareScreen: boolean;
  setShareScreen: (param: boolean) => void;
  userList: UserObj[];
}

export default function SideBar({
  voice,
  setVoice,
  camera,
  setCamera,
  shareScreen,
  setShareScreen,
  userList,
}: Props) {
  return (
    <section className="max-w-[240px] h-[92.7vh] relative scrollbar-sidebar flex grow flex-col gap-y-5 overflow-y-auto border-r border-primary-100 bg-primary">
      <TitleBar />
      <ChannelBar userList={userList} />
      <FunctionBar
        voice={voice}
        setVoice={setVoice}
        camera={camera}
        setCamera={setCamera}
        shareScreen={shareScreen}
        setShareScreen={setShareScreen}
      />
    </section>
  );
}
