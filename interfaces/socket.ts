export type UserObj = {
  userId: string;
  userPeerId: string;
  userName: string;
  voice: boolean;
};

export type StreamObject = {
  userPeerId: string;
  stream: MediaStream;
};

export type ChannelUser = {
  isActive: boolean;
  userId: string;
  userPeerId: string;
  userName: string;
  audio: boolean;
  video: boolean;
  screen: boolean;
};

export interface IUserProps {
  userObj: UserObj;
  users: UserObj[];
}

export interface IUserIdProps {
  userId: string;
  users: UserObj[];
}
