import PirSensor from '../lib';

const PORT_PATH = 'COM6';  // Sensor serial port path.

const sensor = new PirSensor(PORT_PATH, { autoRead: true });

sensor.on('open', () => console.log('\nPort Opened!\n'));
sensor.on('close', () => console.log('\nPort Closed!\n'));
sensor.on('data', val => console.log('Is target near from sensor? =>', val));
sensor.on('error', err => console.log('Error:', err));
