import React, { useEffect, useRef } from "react";

const VideoChat: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null); // 创建一个新的 useRef 用于预览视频

  useEffect(() => {
    if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
      const config = { video: true, audio: true };

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
  }, []);

  return (
    <div className="video-chat">
      <video ref={videoRef} autoPlay playsInline />
      <div className="preview-video w-[220px]">
        <video ref={previewRef} autoPlay playsInline /> {/* 添加预览视频 */}
      </div>
    </div>
  );
};

export default VideoChat;
