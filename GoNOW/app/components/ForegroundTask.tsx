import { poll } from "../scripts/Polling";
import { useEffect } from "react";

const ForegroundTask: React.FC = () => {
  useEffect(() => {
    const interval = setInterval(() => {
        void poll();
        console.log(`Foreground task executed at ${new Date().toISOString()}`);
    }, 1 * 60 * 1000); // 10 minutes in milliseconds

    return () => { clearInterval(interval); }; // Cleanup when component unmounts
  }, []);

  return null; // No UI needed
};

export default ForegroundTask;
