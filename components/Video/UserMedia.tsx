import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { UserObj, IUserProps } from "@/interfaces/socket";

interface Props {
  muted: boolean;
  camera: boolean;
  shareScreen: boolean;
  socket: Socket;
  peer: any;
  userList: UserObj[];
}

type StreamObject = {
  userPeerId: string;
  stream: MediaStream;
};

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
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<StreamObject[]>([]);
  const [outgoingCalls, setOutgoingCalls] = useState<any[]>([]);
  const [currentCalls, setCurrentCalls] = useState<any[]>([]);
  const [sharedStreams, setSharedStreams] = useState<MediaStream[]>([]);

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
          setSharedStreams((prev) => [...prev, stream]);

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
      const handler = ({ userObj: userObj }: IUserProps) => {
        shareVideo(userObj.userPeerId);
      };
      socket.on("user-connected", handler);

      return () => {
        socket.off("user-connected", handler);
      };
    }
  }, [peer, camera]);

  useEffect(() => {
    const handleRemoteCameraClose = (outgoingIds: string[]) => {
      const newCalls = currentCalls.filter((call: any) => {
        if (outgoingIds.includes(call.connectionId)) {
          setRemoteStreams((prevStreams: StreamObject[]) =>
            prevStreams.filter(
              (stream: StreamObject) => stream.userPeerId !== call.peer
            )
          );
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
          setRemoteStreams((prevStreams: StreamObject[]) => [
            ...prevStreams,
            myStream,
          ]);

          userList
            .filter((userObj: UserObj) => userObj.userPeerId !== peer.id)
            .forEach((userObj: UserObj) => {
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
      socket.emit("camera-close", outgoingIds);
      outgoingCalls.forEach((call) => {
        call.close();
      });
      setOutgoingCalls([]);
      setRemoteStreams((prev: StreamObject[]) =>
        prev.filter((item: StreamObject) => item.userPeerId !== peer.id)
      );
      if (localStream) {
        localStream
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop());
        sharedStreams.forEach((stream: MediaStream) => {
          stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        });
      }
    }
  }, [camera]);

  useEffect(() => {
    //接收远程peer时处理
    if (peer) {
      peer.on("call", (call: any) => {
        setCurrentCalls((prevCalls) => [...prevCalls, call]);
        if (!camera) {
          const emptyStream = new MediaStream();
          call.answer(emptyStream);
        } else {
          call.answer(localStream);
        }
        call.on("stream", function (remoteStream: MediaStream) {
          const newStream = {
            userPeerId: call.peer,
            stream: remoteStream,
          };
          setRemoteStreams((prevStreams: StreamObject[]) => [
            ...prevStreams,
            newStream,
          ]);
        });

        call.on("close", function () {
          setRemoteStreams((prevStreams: StreamObject[]) =>
            prevStreams.filter(
              (stream: StreamObject) => stream.userPeerId !== call.peer
            )
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
    console.log();
  };

  return (
    <div>
      <button className="text-quaternary-400" onClick={handleBug}>
        find bug
      </button>
      <section>
        <ul className="flex gap-3 p-4 bg-primary-100">
          {userList.map((userObj: UserObj) => {
            return (
              <div key={userObj.userPeerId}>
                {remoteStreams.findIndex(
                  (remoteStream: StreamObject) =>
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
                    ref={(ref) => {
                      if (ref) {
                        const stream = remoteStreams.find(
                          (remoteStream: StreamObject) =>
                            remoteStream.userPeerId === userObj.userPeerId
                        )?.stream;

                        if (stream) {
                          ref.srcObject = stream;
                        }
                      }
                    }}
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
