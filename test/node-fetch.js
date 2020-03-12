const fetch = require('node-fetch');

const tempMessage = {
    temp: 1,
    time: 2,
    valid: true
}; 
 
fetch('http://127.0.0.1:3000/api/sensorreading/', {
        method: 'post',
        body:    JSON.stringify(tempMessage),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => console.log(json));