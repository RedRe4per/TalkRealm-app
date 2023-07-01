import { GetServerSidePropsContext } from "next";
import { VideoChat } from "@/components/Video/UserMedia";
import SideBar from "@/components/SideBar";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import useBeforeUnload from "@/hooks/useBeforeUnload";

interface Props {
  roomInfo: any;
}

type UserList = {
  userId: string;
  userName: string;
};

export default function Room(roomInfo: Props) {
  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(false);
  const [shareScreen, setShareScreen] = useState(false);
  const [peer, setPeer] = useState<any>(null);
  const [userList, setUserList] = useState<UserList[]>([]);
  let socketIo: Socket = io(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}`);
  let myPeerId: string = "";
  const peers = {};
  useBeforeUnload();

  useEffect(() => {
    socketIo.on("message", (message) => {
      console.log(message);
    });

    socketIo.on("user-connected", ({ userId: userId, users: users }: any) => {
      setUserList(users);
    });

    socketIo.on(
      "user-disconnected",
      ({ userId: userId, users: users }: any) => {
        setUserList(users);
      }
    );

    import("peerjs").then(({ default: Peer }) => {
      const peer = new Peer();
      setPeer(peer);

      peer.on("open", (id: string) => {
        console.log("My peer ID is: " + id, socketIo);
        socketIo.emit("I-connected", id);
        myPeerId = id;
      });

      // return () => {
      //   socketIo.emit("I-disconnect", peer.id);
      //   socketIo.disconnect();
      //   peer.destroy();
      // };
    });

    return () => {
      socketIo.emit("I-disconnect", myPeerId);
    };
  }, []);

  useEffect(() => {
    console.log("userList", userList);
  }, [userList]);

  const handleMessage = () => {
    console.log("userList", userList);
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
          peers={peers}
          userList={userList}
          setUserList={setUserList}
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
