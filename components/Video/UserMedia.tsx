import React, { useEffect, useRef } from "react";

interface Props {
  muted: boolean;
  camera: boolean;
  shareScreen: boolean;
  socket: any;
  peer: any;
}

export const VideoChat = ({
  muted,
  camera,
  shareScreen,
  socket,
  peer,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);

  const connectToNewUser = (userId: string, stream: any) => {
    //call user并且把本机stream发过去。
    console.log("connectToNewUser");
    const call = peer.call(userId, stream);
    call.on("stream", (userVideoStream: any) => {
      if (videoRef.current) {
        videoRef.current.srcObject = userVideoStream;
      }
    });
    call.on("close", () => {
      videoRef.current?.remove();
    });
  };

  useEffect(() => {
    if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
      const config = { video: camera, audio: muted };

      navigator.mediaDevices
        .getUserMedia(config)
        .then((stream) => {
          if (previewRef.current) {
            previewRef.current.srcObject = stream; //.clone()
          }
          socket.on("user-connected", (userId: string) => {
            //当新用户连接时
            console.log("connected to userId", userId);
            connectToNewUser(userId, stream);
          });

          peer.on("call", (call: any) => {
            console.log("peer call")
            call.answer(stream);
            call.on('stream', function(remoteStream: any) {
              if (videoRef.current) {
                videoRef.current.srcObject = remoteStream;
              }
            });
          });
        })
        .catch((err) => {
          console.error("Error accessing media devices.", err);
        });
    }
  }, [muted, camera, socket]);

  useEffect(() => {
    const startScreenShare = async () => {
      if (
        "mediaDevices" in navigator &&
        "getDisplayMedia" in navigator.mediaDevices
      ) {
        try {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
          });
          if (screenRef.current) {
            screenRef.current.srcObject = screenStream;
          }
        } catch (err) {
          console.error("Error: " + err);
        }
      }
    };

    const stopScreenShare = () => {
      if (screenRef.current && screenRef.current.srcObject) {
        let tracks = (screenRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        screenRef.current.srcObject = null;
      }
    };

    if (shareScreen) {
      startScreenShare();
    } else {
      stopScreenShare();
    }
  }, [shareScreen]);

  return (
    <div className="video-chat">
      <video className="w-[40vw]" ref={videoRef} autoPlay playsInline />
      <video className="w-[40vw]" ref={screenRef} autoPlay playsInline />
      <div className="preview-video w-[220px]">
        <p className="text-primary-400">preview video</p>
        <video ref={previewRef} autoPlay muted playsInline />
      </div>
    </div>
  );
};
