import { scheduleLocalNotification } from '../components/Notifications';
import { PollRequestBody } from '../../../backend/index';
import { getNextEvent } from './Event';
import { getMyLocation } from './Geo';

interface routeResponse {
    travelTime: number;
}


export const POLLING_INTERVAL_MIN = 15; // 15 minutes, minimum recommended interval for background fetch is 15 minutes
export const MS_PER_S = 1000;
export const S_PER_MIN = 60;
const NO_DELAY_S = 1; //needs to be >0
const NOTIFICATION_INTERVAL_MIN = POLLING_INTERVAL_MIN*2;

export const poll = async (): Promise<void> => {
    const url = "https://gonow-5ry2jtelsq-wn.a.run.app/api/poll";
    const current_location = await getMyLocation()
    const next_event = await getNextEvent();
    const access_token = process.env.EXPO_PUBLIC_ACCESS_TOKEN;


    if (next_event !== null) {
        next_event.startTime = new Date(next_event.startTime).toISOString();    //hacky fix to convert to compatible time string for google maps api (RFC 3339)
        console.log("next_event.startTime, ", next_event.startTime);
    }
    else {
        return;
    }

    if( current_location === null) {
        console.error("No current location to poll");
        return;
    }
    else if(access_token === undefined) {
        console.error("No access token found");
        console.log("token:", access_token);
        return;
    }
    else{
        const requestBody: PollRequestBody = {
            event: next_event,
            coordinates: current_location.coordinates,
        }

        try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access-token": access_token
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status.toString()}`);
        }
    
        const data = await response.json() as routeResponse;
        console.log("Response Data:", data);

        // Check when we need to leave to arrive on time
        const travelTime = data.travelTime; // minutes
        const cur_time = +new Date();
        const ms_to_event = +new Date(next_event.startTime) - cur_time; // Date - Date = ms difference
        const min_to_event = ms_to_event/(MS_PER_S*S_PER_MIN); // minutes
        const min_to_leave = Math.floor(min_to_event - travelTime);
        if (min_to_leave < NOTIFICATION_INTERVAL_MIN){ // If we need to leave before the next poll, notify the user and schedule notification
          const immediate_notification_title = "GoNOW Notification";
          let immediate_notification_body = "";
          if(min_to_leave < 0) {
            immediate_notification_body = `You are running ${Math.abs(min_to_leave).toString()} minutes late for ${next_event.name}!`;
          }
          else if (Math.floor(min_to_leave) === 0){
            immediate_notification_body = `Leave now to arrive on time for ${next_event.name}`;
          }
          else{
            immediate_notification_body = `Leave in ${min_to_leave.toString()} minutes to arrive on time for ${next_event.name}`;
            const delayed_notification_title = "GoNOW Notification";
            const delayed_notification_body = `Leave now to arrive on time for ${next_event.name}`;
            await scheduleLocalNotification(delayed_notification_title, delayed_notification_body, Math.ceil(min_to_leave * S_PER_MIN));
          }
          await scheduleLocalNotification(immediate_notification_title, immediate_notification_body, NO_DELAY_S);
        }
      } catch (error) {
        console.error("Error making request:", error);
      }
    }
};

