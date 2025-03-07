import { RouteRequestBody } from '../../../backend/index';
import { getNextEvent } from './Event';
import { getMyLocation } from './Geo';

export const poll = async (): Promise<void> => {
    const url = "https://gonow-5ry2jtelsq-wn.a.run.app/api/poll";
    const current_location = await getMyLocation()
    const next_event = await getNextEvent();
    const access_token = process.env.EXPO_PUBLIC_ACCESS_TOKEN;

    if( current_location === null) {
        console.error("No current location to poll");
        return;
    }
    else if(next_event === null) {
        console.error("No future events to poll for");
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
        console.log(JSON.stringify(requestBody));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status.toString()}`);
        }
    
        const data = response.json();
        console.log("Response Data:", data);
      } catch (error) {
        console.error("Error making request:", error);
      }
    }
};

