import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
} from "unique-names-generator";
import { GetServerSidePropsContext } from "next";
import { VideoChat } from "@/components/Video/UserMedia";
import SideBar from "@/components/SideBar";
import { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import useBeforeUnload from "@/hooks/useBeforeUnload";
import { UserObj, IUserProps, IUserIdProps } from "@/interfaces/socket";
import type { Peer } from "peerjs";

interface Props {
  roomInfo: any;
}

const customConfig: Config = {
  dictionaries: [adjectives, colors],
  separator: "-",
  length: 2,
};

export default function Room(roomInfo: Props) {
  const [voice, setVoice] = useState(false);
  const [camera, setCamera] = useState(false);
  const [shareScreen, setShareScreen] = useState(false);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [userList, setUserList] = useState<UserObj[]>([]);
  const socketIo = useMemo(() => io(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}`), []);
  let myPeerId: string = "";
  useBeforeUnload();

  useEffect(() => {
    socketIo.on("message", (message: any) => {
      console.log(message);
    });

    socketIo.on(
      "user-connected",
      ({ userObj: userObj, users: users }: IUserProps) => {
        setUserList(users);
      }
    );

    socketIo.on(
      "user-disconnected",
      ({ userId: userId, users: users }: IUserIdProps) => {
        setUserList(users);
      }
    );

    import("peerjs").then(({ default: Peer }) => {
      const peer = new Peer();
      setPeer(peer);

      peer.on("open", (id: string) => {
        socketIo.emit("I-connected", {
          userId: "created by database",
          userPeerId: id,
          userName: uniqueNamesGenerator(customConfig),
        });
        myPeerId = id;
      });
    });

    return () => {
      socketIo.emit("I-disconnect", myPeerId);
      socketIo.disconnect();
      if (peer) {
        peer.destroy();
      }
    };
  }, []);

  // useEffect(()=>{
  //     console.log("rerender")
  // })

  const handleMessage = () => {
    console.log("userList", userList);
    if (socketIo) {
      socketIo.emit("message", "Hello from client!");
    }
  };

  return (
    <main className="flex">
      <SideBar
        userList={userList}
        voice={voice}
        setVoice={setVoice}
        camera={camera}
        setCamera={setCamera}
        shareScreen={shareScreen}
        setShareScreen={setShareScreen}
      />
      <section className="flex-grow">
        {/* <button className="text-quaternary" onClick={handleMessage}>
          send message
        </button> */}
        <VideoChat
          voice={voice}
          camera={camera}
          shareScreen={shareScreen}
          socket={socketIo}
          peer={peer}
          userList={userList}
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
