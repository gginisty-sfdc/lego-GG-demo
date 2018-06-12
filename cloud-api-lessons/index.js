var koa = require('koa')
var koaParseJson = require('koa-parse-json')
var route = require('koa-route')
var fetch = require('node-fetch');



var port = Number(process.env.PORT) || 7800
var app = koa() 

/* Beginning code from Julien */

// const EventSource = require("eventsource");

const url = "https://api-http.littlebitscloud.cc/v2/devices/243c201f8634/input";

const token =
  "0818ce2545bb60e2672e5a18a9d7413ecc8534da02785bee59879c0789197143";

// const options = { headers: { Authorization: token } };

// const es = new EventSource(url, options);

// time to wait in ms
const delay = 15000;

let lastHit = new Date().getTime();

const percent = JSON.parse(event.data).percent;
const elapsed = new Date().getTime() - lastHit;
// be sure to wait a little
if (percent !== undefined && elapsed > delay && percent > 3) {
  // send data to sales force
  console.log('sending request. Poids_tonnes__c = ',percent); 
  lastHit = new Date().getTime();
  
  fetch('https://arcane-wave-26677.herokuapp.com/', { 
    method: 'POST',
    body: JSON.stringify({"Poids_tonnes__c":percent,"username":"romain"}),
    headers: {'Content-Type':'application/json'},
  })
  .catch((error) => {
    console.error(error);
  });
}

app.listen(port)
console.log('App booted on port %d', port)
