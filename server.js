// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser')
const cors = require('cors');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Cors for cross origin allowance
app.use(cors());

/* Initializing the main project folder */
app.use(express.static('website'));

/* Create an object to hold data */
const projectData = {};

/* Innitialize the server */
const port = 3000;

const server = app.listen(port, () => { console.log(`server running on Localhost port ${port}`) });

// API Key for OpenWeatherMap
const apiKey = '6d683045209ec584e44b473d68e6e375';

/* Write Express routes (endpoints) for the app */
app.get('/all', (req, res) => {
    res.send(projectData);
});

app.post('/add', (req, res) => {
    projectData.push(req.body);
    res.status(200).send();
});