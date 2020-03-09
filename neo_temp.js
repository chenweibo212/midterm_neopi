const moment = require('moment');
const sensor = require('node-dht-sensor');
const Promise = require('promise');

var usage =
  "USAGE: node sync-implicit.js [sensorType] [gpioPin] <repeats>\n" +
  "    sensorType:\n" +
  "         11: For DHT11 sensor.\n" +
  "         22: For DHT22 or AM2302 sensors.\n\n" +
  "    gpipPin:\n" +
  "         Pin number where the sensor is physically connected to.\n\n" +
  "    repeats:\n" +
  "         How many times the read operation will be performed, default: 10\n";

if (process.argv.length < 3) {
  console.warn(usage);
  process.exit(1);
}

var sensorType = parseInt(process.argv[2], 10);
var gpioPin = parseInt(process.argv[3], 10);

const bunyan = require("bunyan");

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

function fakeData(){
    var dummyMessage;
    const getDate = new Date;
    const date = moment(getDate).format().substring(0,10);

    sensor.initialize({    
        test: {
           fake: {
            temperature: -100,
            humidity: 100
           }
         }
      });
        
      sensor.read(22, 4, function(err, temperature, humidity) {
          if (!err) {
              dummyMessage = {
                  temp: temperature.toFixed(1),
                  date: date,
                  valid: false
              };
              console.log(dummyMessage);
              //send fake data to server
              async() => {
                await fetch ('api/sensorreading/',{
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json',
                     },
                     body: JSON.stringify(dummyMessage),
                }).then(res => res.json()).then(res => console.log(res));
              }
          }
      });  
}

function getReading(){
    var curTemp;
    var tempMessage;

    //check if there is a sensor
    var promiseSensor = new Promise(async function(resolve, reject) {
        var start = new Date().getTime();
        const reading = await sensor.read(sensorType, gpioPin);
        var end = new Date().getTime();
            if (reading.isValid === true){
                resolve("there is sensor");
            } else if ((end-start) > 6000){
                reject(Error(`no sensor after ${end-start}ms`));
            }
    });
    
    promiseSensor.then(function(result) {
        //confirm there is a sensor
        console.log(result);

        setInterval(function(){
            //get sensor reading
            const reading = sensor.read(sensorType, gpioPin);
            curTemp = reading.temperature.toFixed(1);

            const getDate = new Date;
            const date = moment(getDate).format().substring(0,10);

            log.info({temp:`${curTemp}`});

            tempMessage = {
                temp: `${curTemp}`,
                date: `${date}`,
                valid: true
            };

            console.log(tempMessage);
            
            //send message to server
            async() => {
               await fetch ('api/sensorreading/',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(tempMessage), 
               }).then(res => res.json()).then(res => console.log(res));
            }
        }, 1000);
        
      }, function(err) {
        //when there is no sensor, use fake data
        fakeData();
        log.error(err);
        console.log(err);
      });
};

getReading();

//get color config from webapp

//setup serial port
var serialMessage;
var colorH;
var colorConfig = null;

const path = '/dev/ttyACM0';
const SerialPort = require('serialport');
const port = new SerialPort(path, {baudRate: 9600});

if(colorConfig != null){
    colorH = data.hueH;
} else {
    colorH = parseInt(mapRange(curTemp, -10, 35, 240, 0));
}

function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

//send color config to arduino through serial port 
serialMessage = `${colorH}`;
serialTestMessage = `${testColor}`;
var testColor = 1;

setInterval(function() {
    testColor += 10;
    if(testColor > 360){
        testColor = 1;
    }
    serialMessage = `${testColor}`;
    serialTestMessage = `${colorH}`;

    port.write(serialMessage, function(err) {
        if (err) {
            console.log('Error on write: ', err.message);
            log.error('Error on write: ', err.message);
        }
        console.log(serialMessage);
        console.log('message written');
    })
  
    // Open errors will be emitted as an error event
    port.on('error', function(err) {
        console.log('Error: ', err.message)
    })
}, 1000);
