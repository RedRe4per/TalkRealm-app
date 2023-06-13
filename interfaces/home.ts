export interface IRoomCard {
  id: string;
  roomName: string;
  href: string;
  imageUrl: string;
  master: {
    name: string;
    isOnline: boolean;
    href: string;
    imageUrl: string;
  };
}
