import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
  ComputerDesktopIcon,
  CloudIcon,
} from "@heroicons/react/20/solid";

export default function FunctionBar() {
  return (
    <section className="fixed bg-primary-400 bottom-0 h-16 w-[240px] p-4">
      <ul className="menu bg-base-200 rounded-box flex justify-around">
        <li>
          <button className="room-function-bar-button">
            <SpeakerWaveIcon
              className="h-5 w-5 text-secondary"
              aria-hidden="true"
            />
          </button>
        </li>
        <li>
          <button className="room-function-bar-button">
            <VideoCameraIcon
              className="h-5 w-5 text-secondary"
              aria-hidden="true"
            />
          </button>
        </li>
        <li>
          <button className="room-function-bar-button">
            <ComputerDesktopIcon
              className="h-5 w-5 text-secondary"
              aria-hidden="true"
            />
          </button>
        </li>
      </ul>
    </section>
  );
}
