import React, { useEffect, useRef, useState } from "react";

interface Props {
  muted: boolean;
  camera: boolean;
  shareScreen: boolean;
  socket: any;
  peer: any;
  peers: any;
}

export const VideoChat = ({
  muted,
  camera,
  shareScreen,
  socket,
  peer,
  peers,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [localVideoStreamId, setLocalVideoStreamId] = useState('');
  const [remoteUserId, setRemoteUserId] = useState('');

  // const connectToNewUser = (userId: string, stream: any) => {
  //   //call user并且把本机stream发过去。
  //   console.log("connectToNewUser");
  //   const call = peer.call(userId, stream);
  //   call.on("stream", (userVideoStream: any) => {
  //     // if (videoRef.current) {
  //     //   videoRef.current.srcObject = userVideoStream;
  //     // }
  //   });
  //   call.on("close", () => {
  //     videoRef.current?.remove();
  //   });
  // };
  

  // // useEffect(()=>{
  // //   if(peer){
  // //     peer.on("call", (call: any) => {
  // //       console.log("peer call")
  // //       //call.answer(stream);1
  // //       call.on('stream', function(remoteStream: any) {
  // //         if (videoRef.current) {
  // //           videoRef.current.srcObject = remoteStream;
  // //         }
  // //       });
  // //     });

  // //   }
  // // }, [peer])

  // useEffect(()=>{
    
  // })

  // useEffect(() => {
  //   if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
  //     const config = { video: camera, audio: muted };

  //     navigator.mediaDevices
  //       .getUserMedia(config)
  //       .then((stream) => {
  //         if (previewRef.current) {
  //           previewRef.current.srcObject = stream; //.clone()
  //         }
  //         socket.on("user-connected", (userId: string) => {
  //           //当新用户连接时
  //           console.log("connected to userId", userId);
  //           connectToNewUser(userId, stream);
  //         });

  //         peer.on("call", (call: any) => {
  //           console.log("peer call");
  //           call.answer(stream);
  //           call.on('stream', function(remoteStream: any) {
  //             if (videoRef.current) {
  //               videoRef.current.srcObject = remoteStream;
  //             }
  //           });
  //         });
  //       })
  //       .catch((err) => {
  //         console.error("Error accessing media devices.", err);
  //       });
  //   }
  // }, [muted, camera]);

  // useEffect(() => {
  //   const startScreenShare = async () => {
  //     if (
  //       "mediaDevices" in navigator &&
  //       "getDisplayMedia" in navigator.mediaDevices
  //     ) {
  //       try {
  //         const screenStream = await navigator.mediaDevices.getDisplayMedia({
  //           video: true,
  //         });
  //         if (screenRef.current) {
  //           screenRef.current.srcObject = screenStream;
  //         }
  //       } catch (err) {
  //         console.error("Error: " + err);
  //       }
  //     }
  //   };

  //   const stopScreenShare = () => {
  //     if (screenRef.current && screenRef.current.srcObject) {
  //       let tracks = (screenRef.current.srcObject as MediaStream).getTracks();
  //       tracks.forEach((track) => track.stop());
  //       screenRef.current.srcObject = null;
  //     }
  //   };

  //   if (shareScreen) {
  //     startScreenShare();
  //   } else {
  //     stopScreenShare();
  //   }
  // }, [shareScreen]);

  //   const connectToNewUser = (userId: string, stream: any) => {
  //   //call user并且把本机stream发过去。
  //   console.log("connectToNewUser");
  //   const call = peer.call(userId, stream);
  //   call.on("stream", (userVideoStream: any) => {
  //     // if (videoRef.current) {
  //     //   videoRef.current.srcObject = userVideoStream;
  //     // }
  //   });
  //   call.on("close", () => {
  //     videoRef.current?.remove();
  //   });
  // };
  

  const shareVideo = (userId: string) => {
    //if(userId !== peer.id){
       if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
      const config = { video: true, audio: muted }; //此处找到之前的bug。如果把video的value设置为状态变量，会导致状态变化时此处不变化。

      console.log("shared video to user", userId, "camera1:", camera)
      navigator.mediaDevices
        .getUserMedia(config)
        .then((stream) => {
          console.log("local stream from connected to new user", stream)
          const call = peer.call(userId, stream);
          //peers[userId] = call;
              call.on("close", () => {
                videoRef.current?.remove();
              });
        })
        .catch((err) => {
          console.error("Error accessing media devices.", err);
        });
    }
  }
  //}

  useEffect(()=>{ //新用户登入room时连接。无论任何状态，都发送stream。
    if(peer && camera){
      socket.on("user-connected", (userId: string) => {
      console.log("connected to userId", userId, "peer id:", peer.id);
      shareVideo(userId);
    });
  }
  }, [peer, camera])

  useEffect(() => {
    if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
      const config = { video: camera, audio: muted };

      navigator.mediaDevices
        .getUserMedia(config)
        .then((stream) => {
          if (previewRef.current) {
            previewRef.current.srcObject = stream; //.clone()
            console.log("local stream from useEffect", stream)
          }
        })
        .catch((err) => {
          console.error("Error accessing media devices.", err);
        });
    }
  }, [muted, camera]);

  useEffect(()=>{
    if(peer){
      peer.on("call", (call: any) => {
        console.log("peer call");
        if(!camera){
          console.log("peer call with empty stream");
          const emptyStream = new MediaStream();
          call.answer(emptyStream);
        }else{
          
        }
        call.on('stream', function(remoteStream: any) {
          if (videoRef.current) {
            console.log("get remote stream test2", remoteStream)
            videoRef.current.srcObject = remoteStream;
            const a = remoteStream.getTracks();
            console.log("track", a)
          }
        });
      });
    }
  }, [peer, camera])

  return (
    <div className="video-chat">
      <video className="w-[40vw]" ref={videoRef} autoPlay playsInline muted/>
      <video className="w-[40vw]" ref={screenRef} autoPlay playsInline />
      <div className="preview-video w-[220px]">
        <p className="text-primary-400">preview video</p>
        <video ref={previewRef} autoPlay muted playsInline />
      </div>
    </div>
  );
};
