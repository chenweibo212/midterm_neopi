#include <Adafruit_NeoPixel.h>
#include <SerialCommand.h>
#include <SoftwareSerial.h>

#define PIXEL_PIN 6
#define NUMPIXELS 12

Adafruit_NeoPixel pixels(NUMPIXELS, PIXEL_PIN, NEO_GRB + NEO_KHZ800);

int inData;
int currColor;

void setup() {
  Serial.begin(9600);
  Serial.setTimeout(10);
  while (!Serial);

  pixels.begin();
  pixels.show();
  pixels.setBrightness(50);
}

void loop() {

  // Your operations here

  while (Serial.available() > 0) {
    //convert serial data to int
    inData = Serial.parseInt();
    if (inData != NULL || inData != 0) {
      Serial.println(inData);
      LEDHandler02(inData);
    }
  }
  //colorCycle();

}

void pingHandler ()
{
  Serial.println("PONG");
}

void LEDHandler02(int hue) {
  changeHSV(hue);
}


void changeHSV(int hue) {
  int pixelHue = map(hue, 0, 360, 0, 65536);
  pixels.fill(pixels.gamma32(pixels.ColorHSV(pixelHue)));
  pixels.show();
}

void colorCycle() {
  int pixelHue = map(currColor, 0, 100, 0, 65536);
  for (int i = 0; i < NUMPIXELS; i++) {
    pixels.setPixelColor(i, pixels.gamma32(pixels.ColorHSV(pixelHue)));
  }
  pixels.show();
  currColor++;
  Serial.print(currColor);
  delay(50);
  if (currColor > 360) currColor = 0;
}
