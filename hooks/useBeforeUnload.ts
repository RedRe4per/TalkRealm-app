import { useEffect } from "react";

function useBeforeUnload(message = "Are you sure you want to exit?") {
  useEffect(() => {
    const handleTabClose = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, [message]);
}

export default useBeforeUnload;
