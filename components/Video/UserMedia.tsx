import React, { useEffect, useRef, useState } from "react";

interface Props {
  muted: boolean;
  camera: boolean;
  shareScreen: boolean;
  socket: any;
  peer: any;
  peers: any;
  userList: any;
  setUserList: any;
}

export const VideoChat = ({
  muted,
  camera,
  shareScreen,
  socket,
  peer,
  peers,
  userList,
  setUserList,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteUserId, setRemoteUserId] = useState<string>("");
  const [currentCall, setCurrentCall] = useState<any>(null);
  const [localVideoStreamId, setLocalVideoStreamId] = useState("");

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

      console.log("shared video to user", userId, "camera1:", camera);
      navigator.mediaDevices
        .getUserMedia(config)
        .then((stream) => {
          console.log("local stream from connected to new user", stream);
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
  };
  //}

  useEffect(() => {
    //新用户登入room时连接。无论任何状态，都发送stream。
    if (peer && camera) {
      socket.on("user-connected", ({ userId: userId, users: users }: any) => {
        shareVideo(userId);
      });
    }
  }, [peer, camera]);

  useEffect(() => {
    //开摄像头时，打开本地preview。2.关闭目前的空单向stream。3.重新建立peer.call，把本地stream发送给room内所有人。
    //此处需要满足需求：假设客户端A打开页面时没有share video，客户端B打开时也没有share video。此时客户端A打开share video，客户端B需要能接收到。
    //因此，需要率先获得全房间所有userId，然后遍历shareVideo。
    if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
      const config = { video: camera, audio: muted };

      navigator.mediaDevices
        .getUserMedia(config)
        .then((stream) => {
          if (previewRef.current) {
            previewRef.current.srcObject = stream;
            console.log("local stream from useEffect", stream);
            setLocalStream(stream.clone());
          }

          // if (currentCall) {
          //   currentCall.close();
          //   setCurrentCall(null);
          // }

          console.log("remoteUserId", remoteUserId);
          shareVideo(remoteUserId);
        })
        .catch((err) => {
          console.error("Error accessing media devices.", err);
        });
    }
  }, [muted, camera]);

  useEffect(() => {
    if (peer) {
      peer.on("call", (call: any) => {
        setRemoteUserId(call.peer);
        setCurrentCall(call);

        if (!camera) {
          console.log("peer call with empty stream");
          const emptyStream = new MediaStream();
          call.answer(emptyStream);
        } else {
          console.log("peer call with local stream");
          call.answer(localStream);
        }
        call.on("stream", function (remoteStream: any) {
          if (videoRef.current) {
            console.log("get remote stream test2", remoteStream);
            videoRef.current.srcObject = remoteStream;
            const a = remoteStream.getTracks();
            console.log("track", a);
          }
        });

        call.on("close", function () {
          console.log("peer close");
          call.close();
        });
      });
    }
  }, [peer, camera]);

  return (
    <div className="video-chat">
      <video className="w-[40vw]" ref={videoRef} autoPlay playsInline muted />
      <video className="w-[40vw]" ref={screenRef} autoPlay playsInline />
      <div className="preview-video w-[220px]">
        <p className="text-primary-400">preview video</p>
        <video ref={previewRef} autoPlay muted playsInline />
      </div>
    </div>
  );
};
