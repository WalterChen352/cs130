import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import type { Headers} from 'node-fetch';
dotenv.config();

const app: Express = express();
const PORT = 8080;
const bodyParser= require('body-parser');
app.use(bodyParser.json())

const apiKey = process.env.API_KEY;   



interface RouteRequestBody {
    oriLat: number;
    oriLong: number;
    destLat: number;
    destLong: number;
    travelMode: string;
  }

// TODO: Adding a lint ignore to make it go through for now, but
// we should eventually remove this disable when we have implemented
// more features with api key.
app.get('/api/autoschedule', (req: Request, res: Response) => {
    //TODO
    //parse incoming parameters
    //take into account existing events
    //determine some candidates
    //send send back to user
    res.send('received autoschedule request');
});

app.get('/api/poll', (req: Request, res: Response) => {
    //TODO
    //parse incoming parameters
    //take into account existing events
    //determine some candidates
    //send send back to user
    res.send('received autoschedule request');
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

app.listen(PORT, () => {
    console.log(`Example app listening on port ${String(PORT)}`);
});