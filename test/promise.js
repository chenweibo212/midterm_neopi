var Promise = require('promise');
   
var promiseColorConfig = new Promise(function(resolve, reject){
  var colorConfig = null;
  //fetch color config
  setTimeout(function() {
      resolve("Success!")  // Yay! Everything went well!
  }, 2000)
  if (colorConfig != null){
      resolve("we have a user");
  } else {
      reject("we need fake input");
  }
});

promiseColorConfig.then(function(result){
  console.log(result);
}).catch(function(error){
  console.log(error);
  console.log("use fake input");
}).then(function(){
  var colorS = 0;
  return new Promise((resolve,reject) => {
    if(colorS === 0){
        setTimeout(() => resolve("great"), 2000);
    } else {
        reject("not ok");
    }
  })
}).then(function(result){
  console.log(result);
}).catch(function(error){
  console.log(error);
})
// ,then(function(){
//   console.log("use fake input");
//   colorS = 0;
//   return new Promise((resolve,reject) => {
//     if(colorS === 1){
//         setTimeout(() => resolve("ok"), 2000);
//     } else {
//         reject("not ok");
//     }
//   });
// }).then(function(result){
//   console.log(result);
// }).catch(function(error){
//   consolr.log(error);
// }).then(function(){
//   console.log("we went through");
// })



// new Promise(function(resolve, reject) {

//   setTimeout(() => resolve(1), 1000);

// }).then(function(result) {

//   console.log(result); // 1

//   return new Promise((resolve, reject) => { // (*)
//     setTimeout(() => resolve(result * 2), 1000);
//   });

// }).then(function(result) { // (**)

//   console.log(result); // 2

//   return new Promise((resolve, reject) => {
//     setTimeout(() => resolve(result * 2), 1000);
//   });

// }).then(function(result) {

//   console.log(result); // 4

// });