/* Global Variables */
// API Key for OpenWeatherMap
const apiKey = '6d683045209ec584e44b473d68e6e375';
// Base URL
const baseURL = 'https://api.openweathermap.org/data/2.5/weather';
const countryCode = 'us';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

// Define callback function
const generate = e => {
    e.preventDefault();

    let zipCode = document.querySelector('#zip').value;
    let content = document.querySelector('#feelings').value;

    let input = { 'zipCode': zipCode, 'content': content };
    console.log(input);


    getData(`${baseURL}?zip=${zipCode},${countryCode}&appid=${apiKey}`)
        .then(data => {
            console.log('API data', data);
            let temp = data.main.temp;
            let date = Date(data.dt * 1000);
            console.log(date);
            let newEntry = { 'temp': temp, 'date': date, 'content': content }
            console.log('new entry', newEntry)
            postData('/add', newEntry)
        })
        .then(() => {
            updateDom();
        })
    // .then(window.location.assign('/'))

};

// Add event listener to button
document.querySelector('#generate').addEventListener('click', generate);

// Update DOM
const updateDom = async () => {
    const allData = await getData('/all');
    try {
        const data = await allData;
        console.log(data)
        const entryHolder = document.querySelector('#entryHolder');
        const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const dateTimeFormat = new Intl.DateTimeFormat('en-US', dateOptions);
        const mostRecent = data.pop();
        console.log(mostRecent)
        const newEntry = entryHolder.cloneNode(true);
        newEntry.removeAttribute('hidden');
        const date = new Date(mostRecent.date);
        const tempK = mostRecent.temp;
        const tempF = (tempK - 273.15) * 1.8 + 32;
        newEntry.querySelector('#date').innerHTML = dateTimeFormat.format(date);
        newEntry.querySelector('#temp').innerHTML = `${Math.round(tempF)}&deg; F`;
        newEntry.querySelector('#content').innerHTML = mostRecent.content;
        document.querySelector('#entriesContainer').insertBefore(newEntry, entryHolder.nextSibling)
        console.log(newEntry)

    } catch (error) {
        console.log('error', error);
    }
};

// Build initial DOM
const buildDom = async () => {
    const allData = await getData('/all');
    try {
        const data = await allData;
        data.reverse();
        const entryHolder = document.querySelector('#entryHolder');
        const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const dateTimeFormat = new Intl.DateTimeFormat('en-US', dateOptions);
        data.forEach(entry => {
            const newEntry = entryHolder.cloneNode(true);
            const date = new Date(entry.date);
            const tempK = entry.temp;
            const tempF = (tempK - 273.15) * 1.8 + 32;    
            newEntry.querySelector('#date').innerHTML = dateTimeFormat.format(date);
            newEntry.querySelector('#temp').innerHTML = `${Math.round(tempF)}&deg; F`;
            newEntry.querySelector('#content').innerHTML = entry.content;
            entryHolder.parentElement.appendChild(newEntry);
        });
        entryHolder.setAttribute('hidden', true);

    } catch (error) {
        console.log('error', error);
    }
};


// GET data from URL
const getData = async (URL) => {

    const response = await fetch(URL);
    try {
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
};

// POST data to server route
const postData = async (URL = '', DATA = {}) => {
    // console.log("data: ", DATA);
    const response = await fetch(URL, {
        method: 'POST', //POST, GET, PUT, DEL...
        credentials: 'same-origin',
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
        },
        //body data type must match "Content-Type" header
        body: JSON.stringify(DATA)
    });

    try {
        const newData = await response.json();
        // console.log(newData);
        return newData;
    } catch (error) {
        console.log("error: ", error);
    }
};

// Call function to build initial DOM when content is lodaded
document.addEventListener('DOMContentLoaded', buildDom)