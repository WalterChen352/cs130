import { MS_PER_S, poll, POLLING_INTERVAL_MIN, S_PER_MIN } from "../scripts/Polling";
import { useEffect } from "react";

const ForegroundTask: React.FC = () => {
  useEffect(() => {
    void poll(); // Initial call
    const interval = setInterval(() => {
        void poll();
        console.log(`Foreground task executed at ${new Date().toISOString()}`);
    }, POLLING_INTERVAL_MIN * S_PER_MIN * MS_PER_S);

    return () => { clearInterval(interval); }; // Cleanup when component unmounts
  }, []);

  return null; // No UI needed
};

export default ForegroundTask;
