import React, { useEffect, useRef } from "react";

interface Props {
  muted: boolean;
  camera: boolean;
  shareScreen: boolean;
}

export const VideoChat = ({ muted, camera, shareScreen }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null); // 创建一个新的 useRef 用于预览视频

  useEffect(() => {
    console.log(muted, "muted", camera, "camera");
    if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
      const config = { video: camera, audio: muted };

      navigator.mediaDevices
        .getUserMedia(config)
        .then((stream) => {
          // 同样将媒体流与预览视频关联
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          if (previewRef.current) {
            previewRef.current.srcObject = stream.clone();
          }
        })
        .catch((err) => {
          console.error("Error accessing media devices.", err);
        });
    }
  }, [muted, camera]);

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
      <video className="w-[60vw]" ref={videoRef} autoPlay playsInline />
      <div className="preview-video w-[220px]">
        <video ref={previewRef} autoPlay playsInline /> {/* 添加预览视频 */}
      </div>
      <video className="w-[60vw]" ref={screenRef} autoPlay playsInline />
    </div>
  );
};
