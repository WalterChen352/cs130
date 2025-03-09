import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { autoschedule } from './schedule';
import type {Workflow,Coordinates, Event} from './types'
import { computeTravelTime } from './mapsQueries';
import bodyParser from 'body-parser';
import { IncomingHttpHeaders } from 'http';


dotenv.config();

const app: Express = express();
const PORT = process.env.PORT??8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

//metric updaters
const uptimeCheck=(h:IncomingHttpHeaders):boolean=>{
    return h['uptime-check'] ==='true';
}

const updateUsers=(req: Request, res: Response)=>{
    if (uptimeCheck(req.headers)){
        res.status(200).send()
        return
    }
        
    users++;
    console.log(`new users ${String(users)}`)
    res.status(200).json({uid: users});

}

const updateWorkflows=(req: Request, res: Response)=>{
    if (uptimeCheck(req.headers)){
        res.status(200).send()
        return
    }
        
    workflowCreated++;
    console.log(`total workflows ${String(workflowCreated)}`)
    res.status(200).send()
}

const updateTasks=(req:Request, res: Response)=>{
    if (uptimeCheck(req.headers)){
        res.status(200).send()
        return
    }
        
    taskCreated++;
    console.log(`total tasks ${String(taskCreated)}`)
    res.status(200).send()
}

const updateAutoschedule=(req:Request<unknown, unknown, AutoscheduleRequestBody>, result: Event|null)=>{
    if(uptimeCheck(req.headers))
        return
    autoscheduleRequests++;
    if(result !==null)
        autoscheduledTasks++;
    if(autoscheduleRequests > 100 && (autoscheduledTasks/autoscheduleRequests)>.01){
        console.error(`ERROR: success rate of autoscheduling has dropped below 1% to ${String(autoscheduledTasks/autoscheduleRequests)}`)
        return
    }
    console.log(`success rate of autoscheduling is ${String(autoscheduledTasks/autoscheduleRequests)}`)
}

const updateRoute=(req:Request<unknown, unknown, RouteRequestBody>, success:boolean)=>{
    if(uptimeCheck(req.headers))
        return
    routeRequests++;
    if(success)
        routeSuccess++;
    if(routeRequests > 100 && (routeSuccess/routeRequests)>.01){
        console.error(`ERROR: success rate of routes has dropped below 1% to ${String(routeSuccess/routeRequests)}`)
        return
    }
    console.log(`successful route response rate ${String(routeSuccess/routeRequests)}`)
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

app.use((req, res, next) => {
    // Only process if the request is URL-encoded (not JSON)
    if (req.is('application/x-www-form-urlencoded')) {
      req.body = convertTypes(req.body);
    }
    next();
  });

//Metrics tracking functions
app.get('/ping',(req:Request, res:Response)=>updateUsers(req,res))

app.get('/createTask',(req:Request, res: Response)=>updateTasks(req,res))

app.get('/createWorkflow',(req:Request, res: Response)=>updateWorkflows(req, res))


//API Endpoints
app.post('/api/autoschedule', async (req: Request<unknown, unknown, AutoscheduleRequestBody>, res: Response) => {
    console.log('body', req.body)
    //parse incoming parameters
    const style =req.body.workflow.schedulingStyle;
    const {events, workflow, coordinates, duration, timeZone, name, description, transportation, startSearch, daysAhead}=req.body
    let result:null|Event = null;
    //get event
    console.log('transportation', transportation);
    switch(style.id){
        case (0):
            //one per day
            result= await autoschedule(apiKey,workflow, events, coordinates, duration, timeZone, name, description, false, transportation, startSearch, daysAhead)
            break;
        case(1):
            result= await autoschedule(apiKey,workflow, events, coordinates, duration, timeZone, name, description, true, transportation, startSearch, daysAhead)
    }
    if(result===null){
        //failed to autoschedule
        res.status(500).json({message:'Unable to autoschedule'});
    }
    else{
        console.log('travel time in minutes:', result)
        res.status(200).json(JSON.stringify(result))
    }
    updateAutoschedule(req, result)   
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
    let success=false;
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
        success=true;
        //console.log('response data', responseData);
        res.status(200).send(responseData); 

    } catch (error) {
        console.error('Error fetching route:', error);
        res.status(500).send('');
    }
    updateRoute(req, success)
});

app.listen(PORT,() => {
    console.log(`Backend listening on port ${String(PORT)}`);
});

//Auxiliary convert for url-encoded bodies

function convertTypes(obj) {
    // Clone the object to avoid modifying the original
    const result = { ...obj };
    
    // Process each property
    for (const key in result) {

      const value = result[key];
      console.log('key and value', key, value);
      // Handle nested objects (including arrays)
      if (key==='events' && value===''){
        result[key]=[]
        continue;
      }
            
      if (key==='daysOfWeek') {
        // Convert array of string booleans to actual booleans
        result[key] = Array.isArray(value) 
          ? value.map(v => v === 'true') 
          : value;
        console.log(result[key])
        continue;
      }
      if (typeof value === 'object' && value !== null) {
        result[key] = convertTypes(value);
        continue;
      }
      
      // Convert booleans
      if (value === 'true') result[key] = true;
      else if (value === 'false') result[key] = false;
      // Convert numbers
      else if (!isNaN(value) && value !== '') {
        // Preserve strings that are purely numeric (like zip codes)
        if (!/^0\d+$/.test(value)) { // Skip numbers with leading zeros
          result[key] = Number(value);
        }
      }
      // Handle special cases
      
      
    }
    
    return result;
  }
