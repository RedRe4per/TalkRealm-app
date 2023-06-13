import { GetServerSidePropsContext } from "next";
import VideoChat from "@/components/Video/UserMedia";
import SideBar from "@/components/SideBar";
import { useState, useRef } from "react";

interface Props {
  roomInfo: any;
}
export default function Room(roomInfo: Props) {
  const screenRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(false);
  const [shareScreen, setShareScreen] = useState(false);

  const startScreenShare = async () => {
    if ('mediaDevices' in navigator && 'getDisplayMedia' in navigator.mediaDevices) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({video: true});
        if (screenRef.current) {
          screenRef.current.srcObject = screenStream;
        }
      } catch(err) {
        console.error("Error: " + err);
      }
    }
  };

  const stopScreenShare = () => {
    if (screenRef.current && screenRef.current.srcObject) {
      let tracks = (screenRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      screenRef.current.srcObject = null;
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
        startScreenShare={startScreenShare}
        stopScreenShare={stopScreenShare}
      />
      <VideoChat
      muted={muted}
      camera={camera}
      shareScreen={shareScreen}
      ref={screenRef}
       />
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
