const express = require('express');
const app = express();
const PORT = 3000;

require('dotenv').config();

const apiKey= process.env.API_KEY;

app.get('/api/autoschedule', (req, res)=>{
    //TODO
    //parse incoming parameters
    //take into account existing events
    //determine some candidates
    //send send back to user
    res.send('received autoschedule request');
})

app.get('/api/poll', (req, res)=>{
    //TODO
    //parse incoming task for location
    //query against google maps api to ensure arrival time
    //send updated travel time back to user
    res.send('received poll request');
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })
