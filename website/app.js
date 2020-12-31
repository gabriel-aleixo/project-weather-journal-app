/* Global Variables */
// API Key for OpenWeatherMap
const apiKey = '6d683045209ec584e44b473d68e6e375';
// Base URL
const baseURL = 'https://api.openweathermap.org/data/2.5/weather';
const countryCode = 'us';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// Define callback function
const generate = e => {

    const zipCode = document.querySelector('#zip').value;
    const content = document.querySelector('#feelings').value;

    const input = {'zipCode': zipCode, 'content': content };
    console.log(input);


    getData(`${baseURL}?zip=${zipCode},${countryCode}&appid=${apiKey}`)
    .then(data => {
        console.log(data);
        postData('/add')
    })


    console.log(e);
};

// Add event listener to button
document.querySelector('#generate').addEventListener('click', generate);

// GET data from API
const getData = async (URL) => {

    const response = await fetch(URL , {
      method: 'GET', //POST, GET, PUT, DEL...
      headers: {
        Accept: "application/json",
        'Content-Type': 'application/json',
      }
    });
    try {
      const data = await response.json();
      // console.log('data: ', data);
      return data;
    } catch (error) {
      console.log('error', error);
      displayError(error);
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
        "CSRF-Token": Cookies.get("XSRF-TOKEN")
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
      displayError(error);
    }
  };