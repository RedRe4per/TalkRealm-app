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
  userObj: UserObj;
  stream: any;
  socket: Socket;
  isRoomMuted: boolean;
}

export const UserVideoCard = React.memo(
  ({ userObj, stream, socket, isRoomMuted }: Props) => {
    return (
      <div key={userObj.userPeerId} className="relative">
        {!stream ? (
          <li className="w-[180px] h-[136px] px-3 py-2 bg-primary-400 text-secondary rounded-xl border-2 border-secondary-400">
            {userObj.userName}
          </li>
        ) : (
          <video
            key={userObj.userPeerId}
            className={`w-[180px] h-[136px] rounded-xl border-2 ${
              true ? "border-quaternary" : "border-secondary-400"
            }`}
            ref={(ref) => {
              if (ref && stream) {
                ref.srcObject = stream;
              }
            }}
            autoPlay={!isRoomMuted}
            playsInline
            muted={isRoomMuted}
          />
        )}
        <div className="absolute top-0 left-0 w-full h-full bg-transparent flex flex-col-reverse p-3">
          {stream && (
            <div
              className={`absolute top-0 left-0 w-full h-6 rounded-t-xl border-2 border-b-transparent  bg-gray-800 opacity-50 flex items-center justify-center ${
                true ? "border-quaternary" : "border-secondary-400"
              }`}
            >
              <p className="text-secondary-100 text-text-2">
                {userObj.userName}
              </p>
            </div>
          )}
          <div className={`${true ? "hidden" : ""}`}>
            {true ? (
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
