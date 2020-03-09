var Promise = require('promise');
   
const longTask = () => new Promise(resolve =>
  setTimeout(() => resolve("Long task complete."), 2500))

const timeout = (cb, interval) => () =>
  new Promise(resolve => setTimeout(() => cb(resolve), interval))

const onTimeout = timeout(resolve =>
  resolve("The 'maybeLongTask' ran too long!"), 3000)

Promise.race([longTask, onTimeout].map(f => f())).then(console.log)