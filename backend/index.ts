import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import fetch, { Headers } from 'node-fetch';
import { autoschedule } from './schedule';
import type {Workflow,Coordinates, Event, SchedulingStyle} from './types'
import { computeTravelTime } from './mapsQueries';
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT??8080;
app.use(bodyParser.json())

const apiKey = process.env.API_KEY??'';   
const accessToken = process.env.ACCESS_TOKEN??'';

interface RouteRequestBody {
    origin:Coordinates;
    destination:Coordinates;
    travelMode: string;
}

let users=0;

// Autoschedule Metrics
let autoscheduleRequests = 0;
let autoscheduledTasks=0;

// Route Metrics
let routeRequests = 0;
let routeSuccess = 0;

// Other Metrics
let workflowCreated = 0;
let taskCreated = 0;

interface AutoscheduleRequestBody {
    events:Event[],
    workflow: Workflow,
    coordinates: Coordinates,
    duration:number,
    timeZone:string,
    name:string,
    description:string,
    transportation:string
}

app.use((req:Request, res:Response, next) => {
    //authenticate all incoming things
    // console.log(req)
    // console.log(req.headers)
    console.log(req.headers['access-token'])
    if(req.headers['access-token']===undefined || req.headers['access-token']!== accessToken){
        res.status(500).json({message:'unable to authenticate request'})
        return;
    }
    const uid = req.headers['uid']
    next();
})

app.get('/ping',(req:Request, res: Response)=>{
    res.status(200).json({uid: users});
    users++;
    console.log(`new users ${users}`)
})

app.get('/createTask',(req:Request, res: Response)=>{
    taskCreated++;
    console.log(`total tasks ${taskCreated}`)
})

app.get('/createWorkflow',(req:Request, res: Response)=>{
    workflowCreated++;
    console.log(`total workflows ${workflowCreated}`)
})

app.post('/api/autoschedule', async (req: Request<unknown, unknown, AutoscheduleRequestBody>, res: Response) => {
    //parse incoming parameters
    autoscheduleRequests++;
    const style =req.body.workflow.schedulingStyle;
    const {events, workflow, coordinates, duration, timeZone, name, description, transportation}=req.body
    let result:null|Event = null;
    //get event
    console.log('transportation', transportation);
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
        res.status(500).json({message:'Unable to autoschedule'});
    }
    else{
        console.log('travel time in minutes:', result)
        res.status(200).json(JSON.stringify(result))
        autoscheduledTasks++;
    }   
    console.log(`success rate of autoscheduling is ${autoscheduledTasks/autoscheduleRequests}`)
});

app.post('/api/poll', async (req: Request<unknown, unknown, {event:Event, coordinates:Coordinates}>, res: Response) => {
    const result =await computeTravelTime(apiKey, req.body.coordinates, req.body.event.coordinates, req.body.event.transportationMode, null, req.body.event.startTime)
    //send send back to user
    console.log('result')
    res.status(200).json({travelTime: result});
});

app.post('/api/route', async (req: Request<unknown, unknown, RouteRequestBody>, res: Response) => {
    //TODO
    //parse incoming task for location
    console.log(req.body)
    const { origin, destination, travelMode } = req.body;
    
    //construct request
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

    const headers = new Headers({
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': '*'
    });

    const body = JSON.stringify({
        origin: {
            location: { latLng: { latitude: origin.latitude, longitude: origin.longitude } }
        },
        destination: {
            location: { latLng: { latitude: destination.latitude, longitude: destination.longitude } }
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
        //const responseText = await response.text();
        //console.log('Raw response:', responseText);
        const responseData = await response.json();
        console.log('response data', responseData);
        res.status(200).send(responseData); 
        routeSuccess++;

    } catch (error) {
        console.error('Error fetching route:', error);
        res.status(500).send('');
    }
    routeRequests++;
});

app.listen(PORT,() => {
    console.log(`Backend listening on port ${String(PORT)}`);
});