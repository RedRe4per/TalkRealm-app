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
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPc(new RTCPeerConnection());
    }
  }, []);

  // useEffect(() => {
  //   if (typeof window !== 'undefined' && pc) {
  
  //     pc.onicecandidate = (event) => {
  //       if (event.candidate && socket) {
  //         socket.emit('ice-candidate', event.candidate);
  //       }
  //     };
  
  //     setPc(pc);
  //   }
  // }, []);

  useEffect(() => {
    if (pc === null) {
      return;
    }

    const socketIo = io(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}`);

    socketIo.on("message", (message) => {
      console.log(message);
    });

    
      socketIo.on('offer', async (offer) => {
        console.log('Offer received');
        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketIo.emit('answer', answer);
      });
  
      socketIo.on('answer', async (answer) => {
        console.log('Answer received');
        await pc.setRemoteDescription(answer);
      });

      // socketIo.on('ice-candidate', async (candidate) => {
      //   if (pc) {
      //     try {
      //       await pc.addIceCandidate(candidate);
      //     } catch (e) {
      //       console.error('Error adding received ice candidate', e);
      //     }
      //   }
      // });
    

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [pc]);

  const handleMessage = () => {
    if (socket) {
      socket.emit("message", "Hello from client!");
    }
  };

  const handleCreateOffer = async () => {
    if (socket && pc) {
      console.log('Creating offer');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", offer);
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
        <button className="text-green-500" onClick={handleCreateOffer}>
          create offer 
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
