const fetch = require('node-fetch');

const tempMessage = {
    temp: 1,
    time: 2,
    valid: false
}; 
 
// fetch('https://midterm-for-all.herokuapp.com/api/sensorreading/', {
//         method: 'post',
//         body:    JSON.stringify(tempMessage),
//         headers: { 'Content-Type': 'application/json' },
//     })
//     .then(res => res.json())
//     .then(json => console.log(json));

// async() => { await 
// fetch('http://midterm-for-all.herokuapp.com/api/getconfig', {
//         method: 'get',
//         headers: { 'Content-Type': 'application/json' },
//     })
//     .then(res => res.json())
//     .then(
//         (configs) => {
//             lowtemp = JSON.stringify(configs[0].low);
//             hightemp = JSON.stringify(configs[0].high);
//             hue = JSON.stringify(configs[0].hue);
//             console.log(lowtemp + hightemp + hue);
        
//         }
//     );
//}
function wait(ms) {
    // Returns a promise that we can `await`
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        console.log(`Waiting for ${ms}ms`);
        // Resolve the promise with the timeout value,
        // not really important here with what it is resolved
        resolve(ms);
      }, ms);
    });
  }

  async function getData() {
    try {
      // GET some data from whereever
      let response = await fetch('http://midterm-for-all.herokuapp.com/api/getconfig');
  
      let data = await response.json();
      
      return data;
    } catch(err) {
      console.log(err);
      return null;
    }
  }
  
  // IIFE to use `await` at the top level
  (async function() {
    // this is an infinite loop, for developing you might want
    // a way to stop it, can crash your browser if you mess
    // it up inside =)...
    if (true) {
      console.log('getting data...');
      let data = await getData();
      console.log(data[0]);
      
      // here you do something with the new data...
      // e.g. call your `DisplayData(data)` function
      
      // then wait for 5 seconds
      await wait(5000);
    }
  })();

