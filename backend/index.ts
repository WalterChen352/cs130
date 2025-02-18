import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = 3000;
const apiKey = process.env.API_KEY;  // eslint-disable-line

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
    //parse incoming task for location
    //query against google maps api to ensure arrival time
    //send updated travel time back to user
    res.send('received poll request');
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${String(PORT)}`);
});