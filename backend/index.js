const express = require('express');
const app = express();
const PORT = 3000;

require('dotenv').config();

// eslint-disable-next-line no-unused-vars
const apiKey= process.env.API_KEY; 
// TODO: Adding a lint ignore to make it go through for now, but
// we should eventually remove this disable when we have implemented
// more features with api key.

app.get('/api/autoschedule', (req, res)=>{
    //TODO
    //parse incoming parameters
    //take into account existing events
    //determine some candidates
    //send send back to user
    res.send('received autoschedule request');
});

app.get('/api/poll', (req, res)=>{
    //TODO
    //parse incoming task for location
    //query against google maps api to ensure arrival time
    //send updated travel time back to user
    res.send('received poll request');
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
