import { GetServerSidePropsContext } from "next";
import { VideoChat } from "@/components/Video/UserMedia";
import SideBar from "@/components/SideBar";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface Props {
  roomInfo: any;
}
export default function Room(roomInfo: Props) {
  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(false);
  const [shareScreen, setShareScreen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}`);

    socketIo.on("message", (message) => {
      console.log(message);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const handleMessage = () => {
    if (socket) {
      socket.emit("message", "Hello from client!");
    }
  };

  console.log(roomInfo);
  return (
    <main className="flex">
      <SideBar
        muted={muted}
        setMuted={setMuted}
        camera={camera}
        setCamera={setCamera}
        shareScreen={shareScreen}
        setShareScreen={setShareScreen}
      />
      <section>
        <button className="text-quaternary" onClick={handleMessage}>
          send message
        </button>
        <VideoChat muted={muted} camera={camera} shareScreen={shareScreen} />
      </section>
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
