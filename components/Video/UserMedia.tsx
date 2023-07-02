import React, { useEffect, useRef, useState } from "react";
import usePrevious from "@/hooks/usePrevious";

interface Props {
  muted: boolean;
  camera: boolean;
  shareScreen: boolean;
  socket: any;
  peer: any;
  userList: any;
}

export const VideoChat = ({
  muted,
  camera,
  shareScreen,
  socket,
  peer,
  userList,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStreams, setRemoteStreams] = useState<any>([]);
  const [remoteUserPeerId, setRemoteUserPeerId] = useState<string[]>([]);
  const [outgoingCalls, setOutgoingCalls] = useState<any[]>([]);
  const prevCamera = usePrevious(camera);
  const [currentCalls, setCurrentCalls] = useState<any[]>([]);
  const [sharedStreams, setSharedStreams] = useState<any[]>([]);

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

  const shareVideo = (userPeerId: string) => {
    if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
      const config = { video: true, audio: false };
      navigator.mediaDevices
        .getUserMedia(config)
        .then((stream) => {
          const call = peer.call(userPeerId, stream);
          setOutgoingCalls((prevCalls) => [...prevCalls, call]);
          setSharedStreams(prev => [...prev, stream]);

          call.on("close", () => {
            setOutgoingCalls((prevCalls) =>
              prevCalls.filter((item) => item !== call)
            );
            videoRef.current?.remove();
          });
        })
        .catch((err) => {
          console.error("Error accessing media devices.", err);
        });
    }
  };

  useEffect(() => {
    if (peer && camera) {
      const handler = ({ userObj: userObj }: any) => {
        shareVideo(userObj.userPeerId);
      };
      socket.on("user-connected", handler);
  
      return () => {
        socket.off("user-connected", handler);
      };
    }
  }, [peer, camera]);

  useEffect(() => {
    const handleRemoteCameraClose = (outgoingIds: any[]) => {
      const newCalls = currentCalls.filter((call: any) => {
        if (outgoingIds.includes(call.connectionId)) {
          call.close();
          return false;
        } else {
          return true;
        }
      });
      setCurrentCalls(newCalls);
    };
    socket.on("remote-camera-close", handleRemoteCameraClose);
    return () => {
      socket.off("remote-camera-close", handleRemoteCameraClose);
    };
  }, [socket, currentCalls]);

  useEffect(() => {
    console.log(prevCamera, "prevCamera", camera, "camera", localStream)
    //开摄像头时，打开本地preview。2.关闭目前的空单向stream。3.重新建立peer.call
    if (
      "mediaDevices" in navigator &&
      navigator.mediaDevices.getUserMedia &&
      camera
    ) {
      const config = { video: camera, audio: muted };
      navigator.mediaDevices
        .getUserMedia(config)
        .then((stream) => {
          const myStream = {
            userPeerId: peer.id,
            stream: stream,
          };
          setLocalStream(stream);
          setRemoteStreams((prevStreams: any) => [...prevStreams, myStream]);

          console.log("remoteUserId", remoteUserPeerId);
          userList
            .filter((userObj: any) => userObj.userPeerId !== peer.id)
            .forEach((userObj: any) => {
              shareVideo(userObj.userPeerId);
            });
        })
        .catch((err) => {
          console.error("Error accessing media devices.", err);
        });
    } else {
      
        const outgoingIds: string[] = outgoingCalls.map((outgoingCall: any) => {
          return outgoingCall.connectionId;
        });
        console.log("outgoingCalls", outgoingCalls);
        socket.emit("camera-close", outgoingIds);
        outgoingCalls.forEach((call) => {
          call.close();
        });
        setOutgoingCalls([]);
        setRemoteStreams((prev: any) =>
          prev.filter((item: any) => item.userPeerId !== peer.id)
        );
        if (localStream) {
          localStream.getTracks().forEach((track: any) => track.stop());
          sharedStreams.forEach((stream: any)=>{
            stream.getTracks().forEach((track: any) => track.stop());
          })
          //setLocalStream(null);
        }
      
    }
  }, [camera]);

  useEffect(() => {
    //接收远程peer时处理
    if (peer) {
      peer.on("call", (call: any) => {
        //   currentCalls.findIndex((item: any) => item.connectionId === call.connectionId) < 0
        setCurrentCalls((prevCalls) => [...prevCalls, call]);
        setRemoteUserPeerId((prev: any) => {
          if (!prev.includes(call.peer)) {
            return [...prev, call.peer];
          } else {
            return prev;
          }
        });

        if (!camera) {
          const emptyStream = new MediaStream();
          call.answer(emptyStream);
        } else {
          call.answer(localStream);
        }
        call.on("stream", function (remoteStream: any) {
          const newStream = {
            userPeerId: call.peer,
            stream: remoteStream,
          };
          setRemoteStreams((prevStreams: any) => [...prevStreams, newStream]);
        });

        call.on("close", function () {
          //测试，无法监测到发送方直接关闭摄像头或者直接关闭页面
          console.log("close 11111111111111111111");
          setRemoteStreams((prevStreams: any) =>
            prevStreams.filter((stream: any) => stream.userPeerId !== call.peer)
          );
          setRemoteUserPeerId((prev: any) =>
            prev.filter((item: any) => call.peer !== item)
          );
        });
      });
    }

    return () => {
      if (peer) {
        peer.off("call");
      }
    };
  }, [peer, camera]);

  const handleBug = () => {
    console.log("outgoingCalls debug", outgoingCalls, localStream, localStream.getTracks());
  };

  return (
    <div>
      <button className="text-quaternary-400" onClick={handleBug}>
        find bug
      </button>
      <section>
        <ul className="flex gap-3 p-4 bg-primary-100">
          {userList.map((userObj: any) => {
            return (
              <div key={userObj.userPeerId}>
                {remoteStreams.findIndex(
                  (remoteStream: any) =>
                    remoteStream.userPeerId === userObj.userPeerId
                ) < 0 ? (
                  <li className="w-[180px] h-[136px] px-3 py-2 bg-primary-400 text-secondary rounded-xl border-2 border-secondary-400">
                    {userObj.userName}
                  </li>
                ) : (
                  <video
                    key={userObj.userPeerId}
                    className={`w-[180px] h-[136px] rounded-xl border-2 ${
                      userObj.userPeerId === peer.id
                        ? "border-quaternary"
                        : "border-secondary-400"
                    }`}
                    ref={(ref) =>
                      ref &&
                      (ref.srcObject = remoteStreams.find(
                        (item: any) => item.userPeerId === userObj.userPeerId
                      )?.stream)
                    }
                    autoPlay
                    playsInline
                    muted
                  />
                )}
              </div>
            );
          })}
        </ul>
      </section>
      <video className="w-[40vw]" ref={screenRef} autoPlay playsInline />
    </div>
  );
};
