/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react";
import type { Peer } from "peerjs";
import { Socket } from "socket.io-client";
import { UserObj, StreamObject } from "@/interfaces/socket";
import {
  RemoteAudioTracksOff,
  RemoteAudioTracksOn,
} from "@/utils/AudioTracksSwitch";

interface Props {
  peer: Peer | null;
  userObj: UserObj;
  remoteStreams: StreamObject[];
  streamMuted: boolean;
  socket: Socket;
}

export const UserVideoCard = React.memo(
  ({ userObj, remoteStreams, peer, streamMuted, socket }: Props) => {
    const [isMuted, setIsMuted] = useState(true);

    const remoteStream = remoteStreams.find(
      (remoteStream) => remoteStream.userPeerId === userObj.userPeerId
    );

    useEffect(() => {
      RemoteAudioTracksOff(remoteStream);
      const handleRemoteVoiceOn = (peerId: string) => {
        if (peerId === remoteStream?.userPeerId) {
          setIsMuted(false);
          RemoteAudioTracksOn(remoteStream);
        }
      };
      const handleRemoteVoiceOff = (peerId: string) => {
        if (peerId === remoteStream?.userPeerId) {
          setIsMuted(true);
          RemoteAudioTracksOff(remoteStream);
        }
      };
      socket.on("remote-voice-on", handleRemoteVoiceOn);
      socket.on("remote-voice-off", handleRemoteVoiceOff);

      return () => {
        socket.off("remote-voice-on", handleRemoteVoiceOn);
        socket.off("remote-voice-off", handleRemoteVoiceOff);
      };
    }, [remoteStream]);

    return (
      <div key={userObj.userPeerId} className="relative">
        {!remoteStream ? (
          <li className="w-[180px] h-[136px] px-3 py-2 bg-primary-400 text-secondary rounded-xl border-2 border-secondary-400">
            {userObj.userName}
          </li>
        ) : (
          <video
            key={userObj.userPeerId}
            className={`w-[180px] h-[136px] rounded-xl border-2 ${
              userObj.userPeerId === peer!.id
                ? "border-quaternary"
                : "border-secondary-400"
            }`}
            ref={(ref) => {
              if (ref) {
                remoteStream?.stream;
                console.log("first");
                if (remoteStream?.stream) {
                  ref.srcObject = remoteStream?.stream;
                }
              }
            }}
            autoPlay
            playsInline
            muted={isMuted}
          />
        )}
        <div className="absolute top-0 left-0 w-full h-full bg-transparent">
          <div>{isMuted ? "a" : "b"}</div>
        </div>
      </div>
    );
  }
);
