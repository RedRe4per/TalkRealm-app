import { GetServerSidePropsContext } from "next";
import VideoChat from "@/components/Video/UserMedia";
import SideBar from "@/components/SideBar";

interface Props {
  roomInfo: any;
}
export default function Artist(roomInfo: Props) {
  console.log(roomInfo);
  return (
    <main className="flex">
      <SideBar />
      <VideoChat />
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${process.env.NEXT_PUBLIC_ENV}/room/${id}`
  );

  const roomInfo = await response.json();
  return { props: roomInfo };
}
