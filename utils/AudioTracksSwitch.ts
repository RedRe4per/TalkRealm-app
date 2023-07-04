import { StreamObject } from "@/interfaces/socket";

export const RemoteAudioTracksOff = (
  remoteStream: StreamObject | undefined
) => {
  if (remoteStream) {
    remoteStream.stream.getAudioTracks().forEach((track) => {
      track.enabled = false;
    });
  }
};

export const RemoteAudioTracksOn = (remoteStream: StreamObject | undefined) => {
  if (remoteStream) {
    remoteStream.stream.getAudioTracks().forEach((track) => {
      track.enabled = true;
    });
  }
};

export const AudioTracksOff = (stream: MediaStream) => {
  stream.getAudioTracks().forEach((track) => {
    track.enabled = false;
  });
};

export const AudioTracksOn = (stream: MediaStream) => {
  stream.getAudioTracks().forEach((track) => {
    track.enabled = true;
  });
};
