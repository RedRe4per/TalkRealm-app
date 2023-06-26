import { GetServerSidePropsContext } from "next";
import { VideoChat } from "@/components/Video/UserMedia";
import SideBar from "@/components/SideBar";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface Props {
  roomInfo: any;
}
export default function Room(roomInfo: Props) {
  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(false);
  const [shareScreen, setShareScreen] = useState(false);
  const [peer, setPeer] = useState<any>(null);
  let socketIo: Socket = io(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}`);

  useEffect(() => {
    socketIo.on("message", (message) => {
      console.log(message);
    });

    import("peerjs").then(({ default: Peer }) => {
      const peer = new Peer();
      setPeer(peer);

      peer.on("open", (id) => {
        //在 Peer 对象与 PeerServer 成功建立连接时触发的
        console.log("My peer ID is: " + id, socketIo);
        socketIo.emit("user-connected", id);
      });

      // peer.on("connection", (conn) => {
      //   conn.on("data", (data) => {
      //     console.log(data);
      //   });
      // });

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {});

      return () => {
        socketIo.disconnect();
        peer.destroy();
      };
    });
  }, []);

  const handleMessage = () => {
    if (socketIo) {
      socketIo.emit("message", "Hello from client!");
    }
  };

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
        <VideoChat
          muted={muted}
          camera={camera}
          shareScreen={shareScreen}
          socket={socketIo}
          peer={peer}
        />
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
