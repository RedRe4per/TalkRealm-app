import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import type { Peer, MediaConnection } from "peerjs";
import { UserObj, IUserProps, StreamObject } from "@/interfaces/socket";
import { UserVideoCard } from "./UserVideoCard";
import useUpdateUsers from "@/hooks/useUpdateUsers";

interface Props {
  voice: boolean;
  setVoice: any;
  camera: boolean;
  shareScreen: boolean;
  socket: Socket;
  peer: Peer | null;
  userList: UserObj[];
  localUser: any;
}

export const VideoChat = ({
  voice,
  setVoice,
  camera,
  shareScreen,
  socket,
  peer,
  userList,
  localUser,
}: Props) => {
  const [user1, setUser1] = useState<any | null>(null);
  const [user2, setUser2] = useState<any | null>(null);
  const [user3, setUser3] = useState<any | null>(null);
  const [user4, setUser4] = useState<any | null>(null);
  const [user5, setUser5] = useState<any | null>(null);
  const [user6, setUser6] = useState<any | null>(null);
  const [user7, setUser7] = useState<any | null>(null);
  const [user8, setUser8] = useState<any | null>(null);
  const [user9, setUser9] = useState<any | null>(null);
  const [user10, setUser10] = useState<any | null>(null);
  const [user11, setUser11] = useState<any | null>(null);

  const setUserFuncs = useRef([
    setUser1, 
    setUser2, 
    setUser3, 
    setUser4, 
    setUser5, 
    setUser6, 
    setUser7, 
    setUser8, 
    setUser9, 
    setUser10, 
    setUser11
  ]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const [isRoomMuted, setIsRoomMuted] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<StreamObject[]>([]);
  const [outgoingCalls, setOutgoingCalls] = useState<MediaConnection[]>([]);
  const [currentCalls, setCurrentCalls] = useState<MediaConnection[]>([]);
  const [sharedStreams, setSharedStreams] = useState<MediaStream[]>([]);

  useUpdateUsers(userList, localUser, [user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11], setUserFuncs);

  useEffect(() => {
    if (!peer) return;
    if (voice) {
      sharedStreams.forEach((stream: any) => {
        stream.getAudioTracks().forEach((track: any) => {
          track.enabled = true;
        });
      });
      socket.emit("voice-on", peer.id);
    } else {
      sharedStreams.forEach((stream: any) => {
        stream.getAudioTracks().forEach((track: any) => {
          track.enabled = false;
        });
      });
      socket.emit("voice-off", peer.id);
    }
  }, [voice, peer]);

  const shareVideo = (userPeerId: string) => {
    if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
      const config = { video: true, audio: true };
      navigator.mediaDevices
        .getUserMedia(config)
        .then((stream) => {
          stream.getAudioTracks().forEach((track) => {
            track.enabled = false;
          });
          const call = peer!.call(userPeerId, stream);
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
        setTimeout(() => {
          console.log(1);
          setVoice(false);
        }, 2000);
        setTimeout(() => {
          console.log(2);
          setVoice(true);
        }, 2100);
      };
      socket.on("user-connected", handler);

      return () => {
        socket.off("user-connected", handler);
      };
    }
  }, [peer, camera]);

  useEffect(() => {
    const handleRemoteCameraClose = (outgoingIds: string[]) => {
      const newCalls = currentCalls.filter((call: MediaConnection) => {
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
    //开摄像头时，打开本地preview。重新建立peer.call
    if (
      "mediaDevices" in navigator &&
      navigator.mediaDevices.getUserMedia &&
      camera
    ) {
      const config = { video: camera, audio: false };
      navigator.mediaDevices
        .getUserMedia(config)
        .then((stream) => {
          const myStream = {
            userPeerId: peer!.id,
            stream: stream,
          };
          setLocalStream(stream);
          setRemoteStreams((prevStreams: StreamObject[]) => [
            ...prevStreams,
            myStream,
          ]);

          userList
            .filter((userObj: UserObj) => userObj.userPeerId !== peer!.id)
            .forEach((userObj: UserObj) => {
              shareVideo(userObj.userPeerId);
            });
        })
        .catch((err) => {
          console.error("Error accessing media devices.", err);
        });
    } else {
      const outgoingIds: string[] = outgoingCalls.map(
        (outgoingCall: MediaConnection) => {
          return outgoingCall.connectionId;
        }
      );
      socket.emit("camera-close", outgoingIds);
      outgoingCalls.forEach((call) => {
        call.close();
      });
      setOutgoingCalls([]);
      setRemoteStreams((prev: StreamObject[]) =>
        prev.filter((item: StreamObject) => item.userPeerId !== peer!.id)
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
      peer.on("call", (call: MediaConnection) => {
        setCurrentCalls((prevCalls) => [...prevCalls, call]);
        if (!camera) {
          const emptyStream = new MediaStream();
          call.answer(emptyStream);
        } else {
          call.answer(localStream || undefined);
        }
        call.on("stream", function (remoteStream: MediaStream) {
          const newStream = {
            userPeerId: call.peer,
            stream: remoteStream,
          };
          setRemoteStreams((prevStreams: StreamObject[]) => {
            const isStreamExist = prevStreams.some(
              (prevStream) =>
                prevStream.userPeerId === newStream.userPeerId &&
                prevStream.stream.id === newStream.stream.id
            );

            if (!isStreamExist) {
              return [...prevStreams, newStream];
            } else {
              return prevStreams;
            }
          });
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

  const handleCheck = () => {
    console.log(userList, localUser, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11)
  }

  return (
    <div>
      <section>
        <ul className="flex gap-3 p-4 bg-primary-100">
          {userList.map((userObj: UserObj) => {
            return (
              <UserVideoCard
                key={userObj.userPeerId}
                userObj={userObj}
                remoteStreams={remoteStreams}
                peer={peer}
                socket={socket}
                isRoomMuted={isRoomMuted}
              />
            );
          })}
        </ul>
      </section>
      <button className="text-quaternary-400" onClick={handleCheck}>
        Voice on
      </button>
      <video className="w-[40vw]" ref={screenRef} autoPlay playsInline />
    </div>
  );
};
