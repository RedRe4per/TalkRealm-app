export type UserObj = {
  userId: string;
  userPeerId: string;
  userName: string;
};

export type StreamObject = {
  userPeerId: string;
  stream: MediaStream;
};

export interface IUserProps {
  userObj: UserObj;
  users: UserObj[];
}

export interface IUserIdProps {
  userId: string;
  users: UserObj[];
}
