import { IRoomCard } from "@/interfaces/home";

interface Props {
  room: IRoomCard;
}

export default function RoomCard({ room }: Props) {
  return (
    <article
      key={room.id}
      className="flex flex-col items-start justify-between"
    >
      <div className="relative w-full">
        <img
          src={room.imageUrl}
          alt=""
          className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
        />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
      </div>
      <div className="max-w-xl">
        <div className="group relative">
          <h3 className="mt-6 text-lg font-semibold leading-6 text-secondary group-hover:text-secondary-100">
            <a href={room.href}>
              <span className="absolute inset-0" />
              {room.roomName}
            </a>
          </h3>
        </div>
        <div className="relative mt-4 flex items-center gap-x-4">
          <img
            src={room.master.imageUrl}
            alt=""
            className="h-10 w-10 rounded-full bg-gray-100"
          />
          <div className="text-sm leading-6">
            <p className="font-semibold text-secondary-300">
              <a href={room.master.href}>
                <span className="absolute inset-0" />
                {room.master.name}
              </a>
            </p>
            <p
              className={`${
                room.master.isOnline ? "text-green-400" : "text-quaternary"
              }`}
            >
              {room.master.isOnline ? "online" : "offline"}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
