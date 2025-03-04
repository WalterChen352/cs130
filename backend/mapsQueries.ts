import dotenv from 'dotenv';
import { Location } from './types';

const apiKey = process.env.API_KEY;   

const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

const getTimeHeaders = new Headers({
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey ?? '',
        'X-Goog-FieldMask': 'routes.duration'
    });



export const computeTravelTime= async(origin: Location, destination: Location, travelMode: string, departureTime:string|null, arrivalTime:string|null ):Promise<number>=>{
    if((arrivalTime===null && departureTime===null)|| (arrivalTime !== null && departureTime !==null)){
        throw new Error('cannot call getTime with both arrival and departure time')
    }
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
            const duration = data.routes[0].duration
            return Number(duration)
    
        } catch (error) {
            console.error('Error fetching route:', error);
            throw new Error('bad request'+String(error))
        }












}