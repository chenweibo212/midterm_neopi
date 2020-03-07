var number;
var input;

function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

input = 25;
number = mapRange(input, -10, 35, 240, 0);

console.log(number);