/* eslint-disable react/display-name */
import React from "react";
import type { Peer } from "peerjs";
import { UserObj } from "@/interfaces/socket";
import { StreamObject } from "./UserMedia";

interface Props {
  peer: Peer | null;
  userObj: UserObj;
  remoteStreams: StreamObject[];
  streamMuted: boolean;
}

export const UserVideo = React.memo(
  ({ userObj, remoteStreams, peer, streamMuted }: Props) => {
    return (
      <div key={userObj.userPeerId}>
        {remoteStreams.findIndex(
          (remoteStream) => remoteStream.userPeerId === userObj.userPeerId
        ) < 0 ? (
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
                const stream = remoteStreams.find(
                  (remoteStream) =>
                    remoteStream.userPeerId === userObj.userPeerId
                )?.stream;

                if (stream) {
                  ref.srcObject = stream;
                }
              }
            }}
            autoPlay
            playsInline
            muted={streamMuted}
          />
        )}
      </div>
    );
  }
);
