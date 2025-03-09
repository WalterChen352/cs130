import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { autoschedule } from './schedule';
import type {Workflow,Coordinates, Event} from './types'
import { computeTravelTime } from './mapsQueries';
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT??8080;
app.use(bodyParser.json())

const apiKey = process.env.API_KEY ?? '';
const accessToken = process.env.ACCESS_TOKEN ?? '';

export interface PollRequestBody {
    event:Event,
    coordinates:Coordinates;
}

export interface RouteRequestBody{
    origin: Coordinates,
    destination: Coordinates,
    travelMode: string
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
    transportation:string,
    startSearch: string,
    daysAhead: number
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
    next();
})

app.get('/ping',(req:Request, res: Response)=>{
    res.status(200).json({uid: users});
    users++;
    console.log(`new users ${String(users)}`)
})

app.get('/createTask',(req:Request, res: Response)=>{
    taskCreated++;
    console.log(`total tasks ${String(taskCreated)}`)
    res.status(200).send()
})

app.get('/createWorkflow',(req:Request, res: Response)=>{
    workflowCreated++;
    console.log(`total workflows ${String(workflowCreated)}`)
    res.status(200).send()
})

app.post('/api/autoschedule', async (req: Request<unknown, unknown, AutoscheduleRequestBody>, res: Response) => {
    //parse incoming parameters
    autoscheduleRequests++;
    const style =req.body.workflow.schedulingStyle;
    const {events, workflow, coordinates, duration, timeZone, name, description, transportation, startSearch, daysAhead}=req.body
    let result:null|Event = null;
    //get event
    console.log('transportation', transportation);
    switch(style.id){
        case (0):
            //one per day
            result= await autoschedule(apiKey,workflow, events, coordinates, duration, timeZone, name, description, true, transportation, startSearch, daysAhead)
            break;
        case(1):
            result= await autoschedule(apiKey,workflow, events, coordinates, duration, timeZone, name, description, false, transportation, startSearch, daysAhead)
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
    console.log(`success rate of autoscheduling is ${String(autoscheduledTasks/autoscheduleRequests)}`)
});

app.post('/api/poll', async (req: Request<unknown, unknown, PollRequestBody>, res: Response) => {
    const result =await computeTravelTime(apiKey, req.body.coordinates, req.body.event.coordinates, req.body.event.transportationMode, null, req.body.event.startTime)
    //send send back to user
    console.log('result', result);
    res.status(200).json({travelTime: result});
    console.log()
});

app.post('/api/route', async (req: Request<unknown, unknown, RouteRequestBody>, res: Response) => {
    //TODO
    //parse incoming task for location
    console.log(req.body)
    const { origin, destination, travelMode } = req.body;
    
    //construct request
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

    const headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': '*'
    };

    const body = {
        origin: {
            location: { latLng: { latitude: origin.latitude, longitude: origin.longitude } }
        },
        destination: {
            location: { latLng: { latitude: destination.latitude, longitude: destination.longitude } }
        },
        travelMode: travelMode
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) throw new Error(`HTTP Error: ${String(response.status)}`);
        //const responseText = await response.text();
        //console.log('Raw response:', responseText);
        const responseData = await response.json();
        //console.log('response data', responseData);
        res.status(200).send(responseData); 
        routeSuccess++;

    } catch (error) {
        console.error('Error fetching route:', error);
        res.status(500).send('');
    }
    routeRequests++;
    console.log(`successful roue response rat ${String(routeSuccess-routeRequests)}`)
});

app.listen(PORT,() => {
    console.log(`Backend listening on port ${String(PORT)}`);
});