import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { autoschedule } from './schedule';
import type {Workflow,Coordinates, Event, SchedulingStyle} from './types'
import { computeTravelTime } from './mapsQueries';
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT??8080;
app.use(bodyParser.json())

const apiKey = process.env.API_KEY??'';   

export interface travelTimeRequestBody {
    event:Event,
    coordinates:Coordinates,
}

interface RouteRequestBody {
    origin:Coordinates,
    destination:Coordinates,
    travelMode: string,
}

interface AutoscheduleRequestBody {
    events:Event[],
    workflow: Workflow,
    coordinates: Coordinates,
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
    const {events, workflow, coordinates, duration, timeZone, name, description, transportation}=req.body
    let result:null|Event = null;
    //get event
    switch(style.id){
        case (0):
            //one per day
            result= await autoschedule(apiKey,workflow, events, coordinates, duration, timeZone, name, description, true, transportation)
            break;
        case(1):
            result= await autoschedule(apiKey,workflow, events, coordinates, duration, timeZone, name, description, false, transportation)
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

app.get('/api/poll', async (req: Request<unknown, unknown, {event:Event, coordinates:Coordinates}>, res: Response) => {
    const result =await computeTravelTime(apiKey, req.body.coordinates, req.body.event.coordinates, req.body.event.transportationMode, null, req.body.event.startTime)
    //send send back to user
    console.log('result')
    res.status(200).json({travelTime: result});
});


app.listen(PORT,() => {
    console.log(`Backend listening on port ${String(PORT)}`);
});