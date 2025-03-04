import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import fetch, { Headers } from 'node-fetch';
import { autoschedule } from './scheudle';
import type {Workflow,Location, Event, SchedulingStyle} from './types'
import { computeTravelTime } from './mapsQueries';


dotenv.config();

const app: Express = express();
const PORT = process.env.PORT||8080;
const bodyParser= require('body-parser');
app.use(bodyParser.json())

const apiKey = process.env.API_KEY as string;   



interface RouteRequestBody {
    oriLat: number;
    oriLong: number;
    destLat: number;
    destLong: number;
    travelMode: string;
  }

type AutoscheduleRequestBody={
    events:Event[],
    workflow: Workflow,
    location: Location,
    duration:number,
    timeZone:string,
    name:string,
    description:string,
    transportation:string,
    style:SchedulingStyle
}

// TODO: Adding a lint ignore to make it go through for now, but
// we should eventually remove this disable when we have implemented
// more features with api key.
app.get('/api/autoschedule', async (req: Request<unknown, unknown, AutoscheduleRequestBody>, res: Response) => {
    //parse incoming parameters
    const {style } =req.body;
    const {events, workflow, location, duration, timeZone, name, description, transportation}=req.body
    let result:null|Event = null;
    //get event
    switch(style.id){
        case (0):
            //one per day
            result= await autoschedule(apiKey,workflow, events, location, duration, timeZone, name, description, true, transportation)
            break;
        case(1):
            result= await autoschedule(apiKey,workflow, events, location, duration, timeZone, name, description, false, transportation)
    }
    if(result===null){
        //failed to autoschedule
        res.status(500).send('Unable to autoschedule');
    }
    else{
        console.log('travel time in minutes:', result)
        res.status(200).json(JSON.stringify(result))
    }   
});

app.get('/api/poll', async (req: Request<unknown, unknown, {event:Event, location:Location}>, res: Response) => {
    const result =await computeTravelTime(apiKey, req.body.location, req.body.event.location, req.body.event.transportationMode, null, req.body.event.startTime)
    //send send back to user
    console.log('result')
    res.status(200).json({travelTime: result});
});

app.get('/api/route', async (req: Request<unknown, unknown, RouteRequestBody>, res: Response) => {
    //TODO
    //parse incoming task for location
    console.log(req.body)
    const { oriLat, oriLong, destLat, destLong, travelMode } = req.body;
    
    //construct request
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

    const headers = new Headers({
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey ?? '',
        'X-Goog-FieldMask': 'routes.polyline.encodedPolyline'
    });

    const body = JSON.stringify({
        origin: {
            location: { latLng: { latitude: oriLat, longitude: oriLong } }
        },
        destination: {
            location: { latLng: { latitude: destLat, longitude: destLong } }
        },
        travelMode: travelMode
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (!response.ok) throw new Error(`HTTP Error: ${String(response.status)}`);

        const json = await response.json() as Record<string, unknown>;
        res.send(json);

    } catch (error) {
        console.error('Error fetching route:', error);
        res.status(500).send('');
    }
});

app.listen(PORT,() => {
    console.log(`Backend listening on port ${String(PORT)}`);
});