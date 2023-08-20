//https://www.npmjs.com/package/oled-i2c-bus
var i2c = require('i2c-bus'),
    i2cBus = i2c.openSync(1),
    oled = require('oled-i2c-bus');
const font = require('oled-font-pack');

var opts = {
    width: 128,
    height: 32,
    address: 0x3C
};

var display = new oled(i2cBus, opts);
display.clearDisplay();
display.stopScroll();
display.turnOnDisplay();
display.setCursor(0, 0);
display.fillRect(1, 1, 10, 30, 1);
display.startScroll('left', 0, 15);