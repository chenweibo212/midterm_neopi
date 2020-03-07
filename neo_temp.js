const moment = require('moment');
const sensor = require('node-dht-sensor').promises;
var curTemp = 0;

const bunyan = require("bunyan");

var serialMessage;
var colorH;
var colorConfig = null;
var tempConfig = null;

const path = '/dev/ttyACM0';
const SerialPort = require('serialport');
const port = new SerialPort(path, {baudRate: 9600});

const log = bunyan.createLogger({ 
    name: "dht22_max",
    streams: [
        {
            path:"../logs/dht22_weather.log",
            level:"info"
        },
        {
            path:"../logs/dht22_error.log",
            level:"error"
        }
    ]
});

sensor.setMaxRetries(10);

setInterval(async () => {
        try {
            const reading = await sensor.read(22, 4);
            curTemp = reading.temperature;
            log.info({temp:`${curTemp}`});
            //recieve color info from webapp, then
            if(colorConfig != null){
                colorH = data.hue;
            } else {
                colorH = parseInt(mapRange(curTemp, -10, 35, 240, 0));
            }
        } catch (e) {
            console.log("Error!");
            console.log(e);
        } 
}, 1000)

//no sensor


//function sendTemptoServer(){};

function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

//serialMessage = `${colorH}`;
var testColor = 1;

setInterval(function() {
    testColor += 10;
    if(testColor > 360){
        testColor = 1;
    }
    serialMessage = `${testColor}`;
    serialMessage = `${colorH}`;

    port.write(serialMessage, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message)
        }
        console.log(serialMessage);
        console.log('message written');
    })
  
    // Open errors will be emitted as an error event
    port.on('error', function(err) {
        console.log('Error: ', err.message)
    })
}, 1000);
