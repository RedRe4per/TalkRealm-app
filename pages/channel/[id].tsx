import { GetServerSidePropsContext } from "next";
import { useState, useEffect, useMemo } from "react";
import SideBar from "@/components/SideBar";
import { VideoChat } from "@/components/VideoChat";
import { io } from "socket.io-client";
import type { Peer } from "peerjs";

interface Props {
    channelInfo: any;
}

export default function Channel(channelInfo: Props) {
    const [voice, setVoice] = useState(false);
    const [camera, setCamera] = useState(false);
    const [shareScreen, setShareScreen] = useState(false);
    const [peer, setPeer] = useState<Peer | null>(null);
    const [userList, setUserList] = useState<any[]>([]);
    const socketIo = useMemo(
        () => io(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}`),
        []
    );

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
                    setVoice={setVoice}
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