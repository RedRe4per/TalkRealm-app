import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
  ComputerDesktopIcon,
  CloudIcon,
} from "@heroicons/react/20/solid";

interface Props {
  muted: boolean;
  setMuted: (param: boolean) => void;
  camera: boolean;
  setCamera: (param: boolean) => void;
  shareScreen: boolean;
  setShareScreen: (param: boolean) => void;
}

export default function FunctionBar({
  muted,
  setMuted,
  camera,
  setCamera,
  shareScreen,
  setShareScreen,
}: Props) {
  return (
    <section className="fixed bg-primary-400 bottom-0 h-16 w-[240px] p-4">
      <ul className="menu bg-base-200 rounded-box flex justify-around">
        <li>
          <button
            className={`${
              muted ? "bg-quaternary" : "bg-primary-400 hover:bg-primary"
            } room-function-bar-button`}
            onClick={() => setMuted(!muted)}
          >
            <SpeakerWaveIcon
              className="h-5 w-5 text-secondary"
              aria-hidden="true"
            />
          </button>
        </li>
        <li>
          <button
            className={`${
              camera ? "bg-quaternary" : "bg-primary-400 hover:bg-primary"
            } room-function-bar-button`}
            onClick={() => setCamera(!camera)}
          >
            <VideoCameraIcon
              className="h-5 w-5 text-secondary"
              aria-hidden="true"
            />
          </button>
        </li>
        <li>
          <button
            className={`${
              shareScreen ? "bg-quaternary" : "bg-primary-400 hover:bg-primary"
            } room-function-bar-button`}
            onClick={() => setShareScreen(!shareScreen)}
          >
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
