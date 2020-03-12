const moment = require('moment');
const sensor = require('node-dht-sensor');
const Promise = require('promise');

const fetch = require('node-fetch');

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

//setup serial port
var colorH;
var colorConfig = null;
var serialMessage;

const path = '/dev/ttyACM0';
const SerialPort = require('serialport');
const port = new SerialPort(path, {baudRate: 9600}, function(err){
    if (err) {
        return console.log('Error: ', err.message)
      }
});

sensor.setMaxRetries(10);

function fakeData(){
    var dummyMessage;
    const getDate = new Date;
    const date = moment(getDate).format();

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
                  time: date,
                  valid: false
              };
              console.log(dummyMessage);
              //send fake data to server
              //async() => {await 
                    fetch('http://localhost:3000/api/sensorreading/', { //waiting for server url
                    method: 'post',
                    body:
                        JSON.stringify(dummyMessage),
                    headers: { 'Content-Type': 'application/json' },
                }).then(res => res.json()).then(json => console.log(json));
              //}
          }
      });  
}

function realSensor(){
    const reading = sensor.read(sensorType, gpioPin);
    curTemp = reading.temperature.toFixed(1);
    return curTemp
}


function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
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
            curTemp = realSensor();

            const getDate = new Date;
            const date = moment(getDate).format();

            log.info({temp:`${curTemp}`});

            tempMessage = {
                temp: curTemp,
                time: date,
                valid: true
            };

            console.log(tempMessage);
            
            //const url = "a-server-url" + "/api/sensorreading/";
            //send message to server
            //async() => {await 
                fetch('http://localhost:3000/api/sensorreading/', { //waiting for server url
                    method: 'post',
                    body:    JSON.stringify(tempMessage),
                    headers: { 'Content-Type': 'application/json' },
                }).then(res => res.json())
                .then(json => console.log(json));
            //}
        }, 1000);
        
      }).catch(function(err) {
        //when there is no sensor, use fake data
        fakeData();
        log.error(err);
        console.log(err);
      })
};

getReading();

function getColor(){
    var userColorSetting = null;
    var temp = realSensor();
    var presetColor;
    var previousTemp = null;
    var promiseColorConfig = new Promise(async function(resolve,reject){
        //fetch a (url/api/configs/) in certain interval



        if (userColorSetting != null){
            resolve("there is a user");
        } else {
            reject("use fake input");
        }
    })

    promiseColorConfig.then(function(){
        sendToArduino(userColorSetting.toString());
    }).catch(function(err){
        setTimeout(() => {
            console.log(err);
            sendToArduino("315");
            setInterval(() => {
            temp = realSensor();
            presetColor = parseInt(mapRange(temp, -10, 35, 240, 0));
            serialMessage = presetColor.toString();
            console.log(serialMessage);
                if(temp != previousTemp){
                    sendToArduino(serialMessage);
                    previousTemp = temp;
                }
            }, 1000);
        }, 2500);
    })
}

getColor();

function sendToArduino(serialMessage){
    port.write(serialMessage, function(err) {
        if (err) {
            console.log('Error on write: ', err.message);
            log.error('Error on write: ', err.message);
        }
        console.log(serialMessage);
        console.log('message written');
    })
}