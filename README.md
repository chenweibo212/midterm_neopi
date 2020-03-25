# Hardware
<img src="https://github.com/nginelli/PIAP/blob/master/_files/IMG_2114.jpg">
<img src="https://github.com/nginelli/PIAP/blob/master/_files/IMG_6888.jpg">
<img src="https://github.com/nginelli/PIAP/blob/master/_files/build.jpg">
<p align="center">
<img src="https://github.com/nginelli/PIAP/blob/master/_files/neopi.gif"></p>

<br />

## Needed Parts

Rasbperry Pi, Arduino Uno, 10k Ohm Resistor, Neopixel Ring/ 12 RGB LED, DHT22 Digital Temperature and Humidity Sensor, Jumper Wires  <br/>
<img align="left" width="100" height="100" src="https://media.digikey.com/photos/Raspberry%20Pi/RASPBERRY-PI-3.jpg">
<img align="left" width="100" height="100" src="https://www.kitronik.co.uk/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/4/6/4622_large_arduino_uno_main_board.jpg">
<img align="left" width="100" height="100" src="https://www.jameco.com/Jameco/Products/ProdImag/2237221.jpg">
<img align="left" width="100" height="100" src="https://boutique.semageek.com/741-large_default/neopixel-ring-with-12-led-rgb-led-and-driver-integrated.jpg">
<img align="left" width="100" height="100" src="https://img2.bgxcdn.com/thumb/view/upload/G13charger/SKU031549%20.jpg">
<img align="left" width="100" height="100" src="https://cdn.solarbotics.com/wp-content//uploads/45040-img_6236wht-5.jpg">
<br /><br /><br /><br /><br /><br />

## Circuit

<img src="https://github.com/nginelli/PIAP/blob/master/_files/circuit.png">

<br />

## Libraries
### Server modules
npm install promise <br />
npm install moment <br />
npm install dht-sensor <br />
npm install bunyan <br />
npm install serialport <br />
npm install node-fetch <br />
### Arduino Libraries
Adafruit_NeoPixel.h

## Usage
- node neo_temp.js [sensorType] [gpioPin]<br />
- node neo_temp.js [22] [4]

