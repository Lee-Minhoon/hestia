import { useEffect, useState } from "react";

function useIsServer() {
  const [isServer, setIsServer] = useState(true);

  useEffect(() => {
    setIsServer(false);
  }, []);

  return isServer;
}

export { useIsServer };
