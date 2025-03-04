
import { Location } from './types';


const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';





export const computeTravelTime= async(apiKey:string,origin: Location, destination: Location, travelMode: string, departureTime:string|null, arrivalTime:string|null ):Promise<number>=>{
    if((arrivalTime===null && departureTime===null)|| (arrivalTime !== null && departureTime !==null)){
        //request must take one, but not both of these
        throw new Error('cannot call getTime with both arrival and departure time or provided neither')
    }
    //set headers
    const getTimeHeaders = new Headers({
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'routes.duration'
    });
    //set params based on departure or arrive
    const params = departureTime!==null?{
        origin: {
            location: { latLng: { latitude: origin.latitude, longitude: origin.longitude } }
        },
        destination: {
            location: { latLng: { latitude: destination.latitude, longitude: destination.longitude } }
        },
        travelMode: travelMode,
        departureTime: departureTime
        }
        :
        {
            origin: {
            location: { latLng: { latitude: origin.latitude, longitude: origin.longitude } }
        },
        destination: {
            location: { latLng: { latitude: destination.latitude, longitude: destination.longitude } }
        },
        travelMode: travelMode,
        arrivalTime:arrivalTime
        }
    const body=JSON.stringify(params);
    try {
            const response = await fetch(url, {
                method: 'POST',
                headers: getTimeHeaders,
                body: body
            });
    
            if (!response.ok) throw new Error(`HTTP Error: ${String(response.status)}`);
            const data = await response.json() as {routes:[{duration:string}]};
            console.log('data from api req', data)
            const duration = data.routes[0].duration
            //they are all strings that end in s ex: "1800s"
            const parsedDuration= duration.slice(0, duration.length-1)
            console.log(parsedDuration)
            return Math.ceil(Number(parsedDuration)/60) //returns in minutes round up
    
        } catch (error) {
            console.error('Error fetching travel time:', error);
            throw new Error('bad request'+String(error))
        }












}