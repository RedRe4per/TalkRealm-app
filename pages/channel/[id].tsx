import { GetServerSidePropsContext } from "next";
import { useState, useEffect, useMemo } from "react";
import SideBar from "@/components/SideBar";
import { VideoChat } from "@/components/VideoChat";
import { io } from "socket.io-client";
import type { Peer } from "peerjs";
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
} from "unique-names-generator";
import { ChannelUser } from "@/interfaces/socket";

const customConfig: Config = {
  dictionaries: [adjectives, colors],
  separator: "-",
  length: 2,
};

interface Props {
  channelInfo: any;
}

export default function Channel(channelInfo: Props) {
  const [voice, setVoice] = useState(false);
  const [camera, setCamera] = useState(false);
  const [shareScreen, setShareScreen] = useState(false);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [userList, setUserList] = useState<any[]>([]);
  const [localUser, setLocalUser] = useState<any | null>(null);
  const socketIo = useMemo(
    () => io(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}`),
    []
  );
  let myPeerId: string = "";

  useEffect(() => {
    socketIo.on("message", (message: any) => {
      console.log(message);
    });

    socketIo.on("user-connected", ({ userObj, channelUsers }: any) => {
      setUserList(channelUsers);
    });

    socketIo.on("user-disconnected", ({ userObj, channelUsers }: any) => {
      setUserList(channelUsers);
    });

    import("peerjs").then(({ default: Peer }) => {
      const peer = new Peer();
      setPeer(peer);

      peer.on("open", (id: string) => {
        myPeerId = id;
        const localUser = {
          userId: "created by database",
          userPeerId: id,
          userName: uniqueNamesGenerator(customConfig),
          audio: false,
          video: false,
          screen: false,
        };
        setLocalUser(localUser);
        socketIo.emit("I-connected", localUser);
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
        <VideoChat
          voice={voice}
          setVoice={setVoice}
          camera={camera}
          shareScreen={shareScreen}
          socket={socketIo}
          peer={peer}
          userList={userList}
          localUser={localUser}
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
