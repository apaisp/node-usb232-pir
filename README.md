# node-usb232-pir
[![npm version](https://badge.fury.io/js/node-usb232-pir.svg)](https://badge.fury.io/js/node-usb232-pir)
[![Build Status](https://travis-ci.org/doublestat/node-usb232-pir.svg?branch=master)](https://travis-ci.org/doublestat/node-usb232-pir)
[![Coverage Status](https://coveralls.io/repos/github/doublestat/node-usb232-pir/badge.svg?branch=master)](https://coveralls.io/github/doublestat/node-usb232-pir?branch=master)

A Node.js module for CL-USB232-PIR sensor. This module used [node-serialport](https://github.com/node-serialport/node-serialport) which is awesome module to help communicate with sensor with serial port.

## Installation 
```sh
yarn add node-usb232-pir
```

## Usage
```js
import PirSensor from 'node-usb232-pir';

const PORT_PATH = 'COM6';  // Sensor serial port path.

const sensor = new PirSensor(PORT_PATH, { autoRead: true });

sensor.on('open', () => console.log('\nPort Opened!\n'));
sensor.on('close', () => console.log('\nPort Closed!\n'));
sensor.on('data', val => console.log('Is target near from sensor? =>', val));
sensor.on('error', err => console.log('Error:', err));
```

### Options
| Name                     | Type         | Description                                                                                            |
|--------------------------|--------------|--------------------------------------------------------------------------------------------------------|
| `autoRead`               | boolean      | Automatically opens the port and read sensor data. Default is `true`.                                  |
| `customSerialPortModule` | `SerialPort` | Custom serial port module. Check out [here](https://github.com/node-serialport/node-serialport#usage). |

### Events
| Name    | data       | Description                                                                                                                   |
|---------|------------|-------------------------------------------------------------------------------------------------------------------------------|
| `open`  | -          | Called when the sensor's port is opened and ready for writing.                                                                |
| `close` | -          | Called when the sensor's port is closed.                                                                                      |
| `data`  | `1` or `0` | Called when the sersor's status changed. If the data returns `1`, the target is near from sensor. And `0`, the target is far. |
| `error` | `Error`    | Called when the error occurred.                                                                                               |

## Test 
```sh
yarn run test
```

## License
This is [MIT licensed](LICENSE) and all it's dependencies are MIT or BSD licensed.
