import { useEffect } from "react";

export default function ForegroundTask() {
  useEffect(() => {
    console.log(`Foreground task executed at ${new Date().toISOString()}`);

    const interval = setInterval(() => {
      console.log(`Foreground task executed at ${new Date().toISOString()}`);
      // TODO: Add your foreground task logic here
    }, 1 * 60 * 1000); // 10 minutes in milliseconds

    return () => { clearInterval(interval); }; // Cleanup when component unmounts
  }, []);

  return null; // No UI needed
}
