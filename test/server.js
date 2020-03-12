const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const moment = require("moment");

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//intializing mongodb
// const mongouri = process.env.MONGODB_URI || "mongodb://localhost:27017/midterm";
// const mongo = require("mongodb").MongoClient;

// let dbclient;
// mongo.connect(mongouri,{
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then((client) => {
//   dbclient = client.db();
//   //after establish connection to mango, start the server
//   const listener = app.listen(port, function () {
//   console.log('Your app is listening on port ' + port);
//   });
// });


//interactions

//get data from senser & store data to mongodb ***the endpoint***

app.post("/api/sensorreading/",async (req, res) => {
  //parsing the data
    const body = req.body;
    //under change - json of specific readings 
    const temp = body.temp;
    const time = new Date(body.time).getTime();
    const valid = body.valid;

  if (!temp || !time || !valid) {
    res.status(400).send({message: "missing some kind of data"});
  } else {
    //some collection under database
    // const midtermCollection = await dbclient.collection("readings");

    //!!!need to convert time to mongodb style!!! or maybe it's the same

    //midtermCollection.insertOne({temp,time,valid});
    res.status(200).send({message: "success"});
  }
});




//take stored data from mongodb and send data to webpage

app.get("/api/data", async (_, res) => {
//   const midtermCollection = await dbclient.collection("readings");
  //const readings = midtermCollection.find({});
  res.json(await readings.toArray());
});


//filter that fetch data from a specific date
app.get('/api/data/:start/:end', async (req, res)=>{

  const start = req.params.start;// what format is this start??
  const end = req.params.end;

//   const readingsCollection = await dbclient.collection("readings");
  //send comparison query to mongo and let it spit out the filtered array

  const query = {time:{$gt: new Date(start),$lt: new Date(end)}};//setting the range
 
  res.json(await readingsCollection.find(query).toArray());
  console.log(query);
 
});



//receive config from webpage

app.post("/api/configs/",async (req, res) => {
  //receiving the request
    const body = req.body;
    //under change - json of specific readings 
    const low = parseInt(body.low);
    const high = parseInt(body.high);
    const hue = parseInt(body.hue);

  if (!low || !high || !hue) {
    res.status(400).send("Missing some kind of config");
  } else {
    //some collection under database
    // const configCollection = await dbclient.collection("config");
    configCollection.insertOne({low,high,hue});
    res.sendStatus(200);
  }
});


//send config to senser


app.get("/api/getconfig", async (_, res) => {
//   const configCollection = await dbclient.collection("config");
  const configs = configCollection.find({});
  res.json(await configs.toArray());
});




























// Special piece for running with webpack dev server
if (process.env.NODE_ENV === "development") {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const config = require('./webpack.dev.config.js');
  const compiler = webpack(config);

  // Tell express to use the webpack-dev-middleware and use the webpack.config.js
  // configuration file as a base.
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }));
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + '/app/index.html');
});

app.listen(3000, function () {
      console.log('Your app is listening on port ' + port);
});
