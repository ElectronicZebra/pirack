//https://www.npmjs.com/package/oled-i2c-bus
var ip = require("ip");
var os = require("os");
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
//console.dir(appDir);
const si = require('systeminformation');
var i2c = require('i2c-bus'),
    i2cBus = i2c.openSync(1),
    oled = require('oled-i2c-bus');
var font = require('oled-font-5x7');
var fs = require('fs');
var obj = JSON.parse(fs.readFileSync(appDir + '/settings.json', 'utf8'));
//console.dir(obj);

var opts = {
    width: 128,
    height: 32,
    address: 0x3C
};

const TOTAL_MESSAGES = 5;
const MESSAGE_DISPLAY_MILLISECONDS = 5000;

var display = new oled(i2cBus, opts);
display.clearDisplay();
display.stopScroll();
display.turnOnDisplay();

// message rotation
var current_message = 1;
setInterval(() => {

    switch (current_message) {
        case 1:
            dispAppDetails();
            break;
        case 2:
            dispTemps();
            break;
        case 3:
            dispCPUInfo();
            break;
        case 4:
            dispMEMInfo();
            break;
        case 5:
            dispDISKInfo();
            break;
    }

    if (current_message == TOTAL_MESSAGES) {
        current_message = 1;
    } else {
        current_message++;
    }
}, MESSAGE_DISPLAY_MILLISECONDS);


dispAppDetails = function () {
    display.clearDisplay();
    display.setCursor(1, 1);
    display.writeString(font, 2, obj.appName, 1, false);
    display.setCursor(1, 20);
    display.writeString(font, 1, os.hostname() + ' ' + ip.address(), 1, false);
}

dispTemps = function () {
    display.clearDisplay();
    si.cpuTemperature()
        .then(function (data) {
            display.setCursor(1, 1);
            display.writeString(font, 2, 'TEMP : ' + Math.round(data.main) + ' C', 1, false);
            display.setCursor(1, 18);
            display.writeString(font, 2, 'MAX  : ' + Math.round(data.max) + ' C', 1, false);

        })
        .catch(error => console.error(error));
}

dispCPUInfo = function () {
    display.clearDisplay();
    si.currentLoad()
        .then(function (data) {
            display.setCursor(1, 1);
            display.writeString(font, 2, 'CPU : ' + Math.round(data.currentLoad) + ' %', 1, false);
            display.setCursor(1, 18);
            display.writeString(font, 2, 'IDL : ' + Math.round(data.currentLoadIdle) + ' %', 1, false);
        })
        .catch(error => console.error(error));
}

dispMEMInfo = function () {
    display.clearDisplay();
    si.mem()
        .then(function (data) {
            display.setCursor(1, 1);
            display.writeString(font, 2, 'MEM : ' + Math.round((data.active / data.total) * 100) + ' %', 1, false);
            display.setCursor(1, 18);
            display.writeString(font, 2, 'SWP : ' + Math.round((data.swapused / data.swaptotal) * 100) + ' %', 1, false);
        })
        .catch(error => console.error(error));
}

dispDISKInfo = function () {
    display.clearDisplay();
    si.fsSize()
        .then(function (data) {
            display.setCursor(1, 1);
            display.writeString(font, 2, 'U : ' + (data[0].used / (1024 * 1024 * 1024)).toFixed(1) + 'G', 1, false);
            display.setCursor(1, 18);
            display.writeString(font, 2, 'T : ' + (data[0].size / (1024 * 1024 * 1024)).toFixed(1) + 'G', 1, false);
        })
        .catch(error => console.error(error));
}
