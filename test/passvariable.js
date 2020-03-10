// var curTemp;

// function getTemp (){
//     return curTemp;
// }

// function outputTemp(){
//    var curTemp = 10;
//    getTemp.apply(curTemp);
// }

// console.log(getTemp());

function a(){
    b.apply(null, arguments);
}
function b(){
   return arguments[0]; //arguments[0] = 1, etc
}

console.log(a(1,2,3));​