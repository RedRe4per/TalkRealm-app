import React, { useEffect, useState } from "react";
import type { Peer } from "peerjs";
import { Socket } from "socket.io-client";
import { UserObj, StreamObject } from "@/interfaces/socket";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/20/solid";
import {
  RemoteAudioTracksOff,
  RemoteAudioTracksOn,
} from "@/utils/AudioTracksSwitch";

interface Props {
  peer: Peer | null;
  userObj: UserObj;
  remoteStreams: StreamObject[];
  socket: Socket;
  isRoomMuted: boolean;
}

export const UserVideoCard = React.memo(
  ({ userObj, remoteStreams, peer, socket, isRoomMuted }: Props) => {
    const [isRemoteMuted, setIsRemoteMuted] = useState(!userObj.voice);

    const remoteStream = remoteStreams.find(
      (remoteStream) => remoteStream.userPeerId === userObj.userPeerId
    );

    useEffect(() => {
      isRemoteMuted
        ? RemoteAudioTracksOff(remoteStream)
        : RemoteAudioTracksOn(remoteStream);
      const handleRemoteVoiceOn = (peerId: string) => {
        if (peerId === remoteStream?.userPeerId) {
          RemoteAudioTracksOn(remoteStream);
          setIsRemoteMuted(false);
        }
      };
      const handleRemoteVoiceOff = (peerId: string) => {
        if (peerId === remoteStream?.userPeerId) {
          RemoteAudioTracksOff(remoteStream);
          setIsRemoteMuted(true);
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
              if (ref && remoteStream?.stream) {
                ref.srcObject = remoteStream.stream;
              }
            }}
            autoPlay
            playsInline
            muted={isRoomMuted}
          />
        )}
        <div className="absolute top-0 left-0 w-full h-full bg-transparent flex flex-col-reverse p-3">
          {remoteStream && (
            <div
              className={`absolute top-0 left-0 w-full h-6 rounded-t-xl border-2 border-b-transparent  bg-gray-800 opacity-50 flex items-center justify-center ${
                userObj.userPeerId === peer!.id
                  ? "border-quaternary"
                  : "border-secondary-400"
              }`}
            >
              <p className="text-secondary-100 text-text-2">
                {userObj.userName}
              </p>
            </div>
          )}
          <div className={`${userObj.userPeerId === peer!.id ? "hidden" : ""}`}>
            {isRemoteMuted ? (
              <SpeakerXMarkIcon
                className="h-5 w-5 text-secondary"
                aria-hidden="true"
              />
            ) : (
              <SpeakerWaveIcon
                className="h-5 w-5 text-green-400 brightness-125"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);
