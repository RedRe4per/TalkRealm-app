import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import type { Peer, MediaConnection } from "peerjs";
import { UserObj, IUserProps, StreamObject } from "@/interfaces/socket";
import { UserVideoCard } from "./UserVideoCard";
import { useUpdateEffect } from 'usehooks-ts'
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
  setLocalUser: any;
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
  setLocalUser,
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
  const remoteUserList = [
    user1,
    user2,
    user3,
    user4,
    user5,
    user6,
    user7,
    user8,
    user9,
    user10,
    user11,
  ];
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
    setUser11,
  ]);

  useUpdateUsers(
    userList,
    localUser,
    [
      user1,
      user2,
      user3,
      user4,
      user5,
      user6,
      user7,
      user8,
      user9,
      user10,
      user11,
    ],
    setUserFuncs
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const [isRoomMuted, setIsRoomMuted] = useState(true);
  const [localStream, setLocalStream] = useState<any>(null)

  const shareVideo = (remotePeerId: string) => {
    console.log("share video")
    if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
      const config = { video: true, audio: true };
      navigator.mediaDevices
        .getUserMedia(config)
        .then((stream) => {
          stream.getAudioTracks().forEach((track) => {
            track.enabled = false;
          });
          const call = peer!.call(remotePeerId, stream);
          const userIndex = remoteUserList.findIndex(
            (user: any) => user.userPeerId === remotePeerId
          );
          remoteUserList[userIndex].outgoingCall = call;
          remoteUserList[userIndex].sharedStream = stream;
        })
        .catch((err) => {
          console.error("Error accessing media devices.", err);
        });
    }
  };

  useEffect(() => {
    //开摄像头后，当有新用户登入时，share video给它。后续声音也用这个
    if (peer && camera) {
      const handler = ({ userObj }: IUserProps) => {
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
  }, [
    peer,
    camera,
    localUser,
  ]);

  useEffect(() => {
    if (!peer) return;
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
          setLocalUser((prev: any) => {
            const newItem = prev;
            newItem.localStream = stream;
            return newItem;
          })
          setLocalStream(stream);
          remoteUserList.forEach((userObj: UserObj) => {
            if (userObj) shareVideo(userObj.userPeerId);
          });
        })
        .catch((err) => {
          console.error("Error accessing media devices.", err);
        });
    }
  }, [
    peer,
    camera,
    localUser,
  ]);

  useUpdateEffect(() => {
    if (camera || !peer) return;
    if (localStream) localStream
      .getTracks()
      .forEach((track: MediaStreamTrack) => track.stop());
      setLocalStream(null)
    //Compensation for PeerJS bugs
    socket.emit("camera-close-bugfix", peer.id);
    setLocalStream(null);
    remoteUserList.filter((remoteUser) => remoteUser).forEach((remoteUser: any) => {
        if(remoteUser.outgoingCall) remoteUser.outgoingCall.close()
        //remoteUser.outgoingCall = null;
        if(remoteUser.sharedStream) remoteUser.sharedStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        //remoteUser.sharedStream = null;
    });

  }, [camera])

  useEffect(() => {
    //接收远程peer时处理
    const remoteUserList = [
      user1,
      user2,
      user3,
      user4,
      user5,
      user6,
      user7,
      user8,
      user9,
      user10,
      user11
    ]
    if (peer) {
      peer.on("call", (call: MediaConnection) => {
        if (!camera) {
          const emptyStream = new MediaStream();
          call.answer(emptyStream);
        } else {
          call.answer(localUser.localStream || undefined);
        }
        call.on("stream", function (remoteStream: MediaStream) {
          console.log("get call stream,", remoteStream, remoteUserList)
          const index = remoteUserList.findIndex(
            (remoteUser: any) => remoteUser?.userPeerId === call.peer
          );
          console.log(index, "index")
          if (index > -1) {
            //remoteUserList[index].remoteStream = remoteStream;
            setUserFuncs.current[index]((prev: any) => Object.assign({ remoteStream }, prev));
            console.log(remoteUserList, "remoteUserList2")
          }
        });
      });
    }

    return () => {
      if (peer) {
        peer.off("call");
      }
    };
  }, [
    peer,
    camera,
    localUser,
    user1,
    user2,
    user3,
    user4,
    user5,
    user6,
    user7,
    user8,
    user9,
    user10,
    user11
  ]);

  useEffect(() => {
    const remoteUserList = [
      user1,
      user2,
      user3,
      user4,
      user5,
      user6,
      user7,
      user8,
      user9,
      user10,
      user11
    ]
    //补偿peerJS的bug
    const handleRemoteCameraClose = (peerId: string[]) => {
      const userIndex = remoteUserList.findIndex(
        (user: any) => user?.userPeerId === peerId
      );
      setUserFuncs.current[userIndex]((prev: any) => {
        Object.assign({ remoteStream: null }, prev)
      });
    };
    socket.on("remote-camera-close-bugfix", handleRemoteCameraClose);
    return () => {
      socket.off("remote-camera-close-bugfix", handleRemoteCameraClose);
    };
  }, [socket, user1,
    user2,
    user3,
    user4,
    user5,
    user6,
    user7,
    user8,
    user9,
    user10,
    user11]);

  const handleCheck = () => {
    console.log(userList, "list")
    console.log(
      localStream ? localStream.getTracks() : "no"
    );
  };

  return (
    <section>
      <section>
        <ul className="flex gap-3 p-4 bg-primary-100">
          {localUser && (
            <UserVideoCard
              key={localUser.userPeerId}
              userObj={localUser}
              stream={localStream}
              socket={socket}
              isRoomMuted={isRoomMuted}
            />
          )}
          {user1 && (
            <UserVideoCard
              key={user1.userPeerId}
              userObj={user1}
              stream={user1.remoteStream}
              socket={socket}
              isRoomMuted={isRoomMuted}
            />
          )}
          {user2 && (
            <UserVideoCard
              key={user2.userPeerId}
              userObj={user2}
              stream={user2.remoteStream}
              socket={socket}
              isRoomMuted={isRoomMuted}
            />
          )}
          {user3 && (
            <UserVideoCard
              key={user3.userPeerId}
              userObj={user3}
              stream={user3.remoteStream}
              socket={socket}
              isRoomMuted={isRoomMuted}
            />
          )}
          {user4 && (
            <UserVideoCard
              key={user4.userPeerId}
              userObj={user4}
              stream={user4.remoteStream}
              socket={socket}
              isRoomMuted={isRoomMuted}
            />
          )}
          {user5 && (
            <UserVideoCard
              key={user5.userPeerId}
              userObj={user5}
              stream={user5.remoteStream}
              socket={socket}
              isRoomMuted={isRoomMuted}
            />
          )}
          {user6 && (
            <UserVideoCard
              key={user6.userPeerId}
              userObj={user6}
              stream={user6.remoteStream}
              socket={socket}
              isRoomMuted={isRoomMuted}
            />
          )}
          {user7 && (
            <UserVideoCard
              key={user7.userPeerId}
              userObj={user7}
              stream={user7.remoteStream}
              socket={socket}
              isRoomMuted={isRoomMuted}
            />
          )}
          {user8 && (
            <UserVideoCard
              key={user8.userPeerId}
              userObj={user8}
              stream={user8.remoteStream}
              socket={socket}
              isRoomMuted={isRoomMuted}
            />
          )}
          {user9 && (
            <UserVideoCard
              key={user9.userPeerId}
              userObj={user9}
              stream={user9.remoteStream}
              socket={socket}
              isRoomMuted={isRoomMuted}
            />
          )}
          {user10 && (
            <UserVideoCard
              key={user10.userPeerId}
              userObj={user10}
              stream={user10.remoteStream}
              socket={socket}
              isRoomMuted={isRoomMuted}
            />
          )}
          {user11 && (
            <UserVideoCard
              key={user11.userPeerId}
              userObj={user11}
              stream={user11.remoteStream}
              socket={socket}
              isRoomMuted={isRoomMuted}
            />
          )}
        </ul>
      </section>
      <button className="text-quaternary-400" onClick={handleCheck}>
        Voice on
      </button>
      <video className="w-[40vw]" ref={screenRef} autoPlay playsInline />
    </section>
  );
};
