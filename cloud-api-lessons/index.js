var koa = require('koa')
var koaParseJson = require('koa-parse-json')
var route = require('koa-route')
var fetch = require('node-fetch');



var port = Number(process.env.PORT) || 7800
var app = koa() 

app.use(koaParseJson())

/* Beginning code from Julien */

// const EventSource = require("eventsource");

app.use(route.get('/', function *() {

  this.body = 'Hello, this is a trivial cloudBit Reader App. Nothing else to see here; all the action happens server-side.  To see any recent input activity from webhook-registered cloudBits do this on the command line: `heroku logs --tail`.'

}))

const url = "https://api-http.littlebitscloud.cc/v2/devices/243c201f8634/input";

const token =
  "0818ce2545bb60e2672e5a18a9d7413ecc8534da02785bee59879c0789197143";

const delay = 15000;

let lastHit = new Date().getTime();

app.use(route.post('/', function *() {

  if (this.request.body && this.request.body.type) {
    
    handleCloudbitEvent(this.request.body)
  }

  this.body = 'OK'

}))



app.listen(port)
console.log('App booted on port %d', port)



// Helpers

function handleCloudbitEvent(event) {
  console.log('event: ',event);
  lastHit = new Date().getTime();
  switch (event.type) {
    case 'amplitude':
      // Do whatever you want with the amplitde
      console.log('inside switch case, event.payload: ',event.payload)
      console.log('cloudBit input received: %d%', event.payload.percent)
      const percent = event.payload.percent;
      console.log("percent value: ", percent);
        fetch('https://arcane-wave-26677.herokuapp.com/', { 
          method: 'POST',
          body: JSON.stringify({"Poids_tonnes__c":percent,"username":"romain"}),
          headers: {'Content-Type':'application/json'},
        })
          .then(res => res.json())
          .then(json => console.log("json", json))
          .catch(err => console.error("err", err));
      break
    case 'connectionChange':
      // One day, cloudBits will emit this event too, but not yet.
      break
    default:
      console.warn('cloudBit sent an unexpected event: %j', event)
      break
  }
}