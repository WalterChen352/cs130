import { min } from 'lodash';
import { RouteRequestBody } from '../../../backend/index';
import { getNextEvent } from './Event';
import { getMyLocation } from './Geo';

interface routeResponse {
    travelTime: number;
}

const MS_PER_S = 1000;
const S_PER_MIN = 60;

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
        console.error("No future events to poll for");
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
        const requestBody: RouteRequestBody = {
            event: next_event,
            coordinates: current_location.coordinates,
        }

        try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access-token": access_token,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status.toString()}`);
        }
    
        const data = await response.json() as routeResponse;
        console.log("Response Data:", data);

        // Check when we need to leave to arrive on time
        const travelTime = data.travelTime;
        const cur_time = +new Date();
        const ms_to_event = +new Date(next_event.startTime) - cur_time; // milliseconds
        const min_to_event = ms_to_event/(MS_PER_S*S_PER_MIN); // minutes
        if (min_to_event < travelTime){
            console.log("GO NOW");
        }
      } catch (error) {
        console.error("Error making request:", error);
      }
    }
};

