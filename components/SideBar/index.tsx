import ChannelBar from "./ChannelBar";
import TitleBar from "./TitleBar";
import FunctionBar from "./FunctionBar";

export default function SideBar() {
  return (
    <section className="max-w-[240px] h-[92.7vh] relative scrollbar-sidebar flex grow flex-col gap-y-5 overflow-y-auto border-r border-primary-100 bg-primary">
      <TitleBar />
      <ChannelBar />
      <FunctionBar />
    </section>
  );
}
