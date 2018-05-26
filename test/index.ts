import * as chai from 'chai';
import * as SerialPort from 'serialport/test';
const MockBinding = SerialPort.Binding;
import PirSensor from '../lib';


/***** Prepare for testing. *****/

// Prepare dummy data for testing.
const SENSOR_NEAR_DATA = new Buffer([16, 54, 0, 1, 1, 0, 0, 0, 0, 32, 146, 0, 0, 0, 0, 0]);
const SENSOR_FAR_DATA = new Buffer([16, 54, 0, 1, 0, 0, 0, 0, 0, 32, 146, 0, 0, 0, 0, 0]);

// Create virutial port for testing.
MockBinding.createPort('COM_VALID', { echo: false, record: false });



/***** Start testing. *****/

let pSensor: PirSensor;

describe('PirSensor', () => {

    describe('#constructor', () => {
        it('should return error with invalid serial port', (done: MochaDone) => {
            pSensor = new PirSensor('COM_INVALID', {
                autoRead: true,
                customSerialPortModule: SerialPort
            });
            pSensor.once('open', () => done(new Error()));
            pSensor.once('error', () => done());
        });

        it('should construct and autoload without error', (done: MochaDone) => {
            pSensor = new PirSensor('COM_VALID', {
                autoRead: true,
                customSerialPortModule: SerialPort
            });
            pSensor.once('open', () => {
                pSensor.close();
                done();
            });
            pSensor.once('error', done);
        });

        it('should construct without error', (done: MochaDone) => {
            setTimeout(() => {
                pSensor = new PirSensor('COM_VALID', {
                    autoRead: false,
                    customSerialPortModule: SerialPort
                });
                pSensor.once('error', done);
                setTimeout(done, 10);
            }, 10);
        });
    });

    describe('#open()', () => {
        it('should open port without error', (done: MochaDone) => {
            pSensor.open();
            pSensor.once('open', done);
            pSensor.once('error', done);
        });
    });

    describe('#readOnce()', () => {
        it('should read sersor data once and return 0 or 1 without error', (done: MochaDone) => {
            pSensor.readOnce();
            (pSensor.sPort as any).binding.emitData(
                Math.round(Math.random()) ?
                    SENSOR_NEAR_DATA : SENSOR_FAR_DATA
            );
            pSensor.once('data', data => {
                try {
                    chai.expect(data).to.satisfy((v: any) => {
                        return (v === 0 || v === 1) ? true : false;
                    });
                    done();
                } catch (e) { done(e); }
            });
        });
    });

    describe('#read()', () => {
        it('should start to read sersor data without error', (done: MochaDone) => {
            pSensor.read();
            pSensor.once('error', err => done(err));
            setTimeout(done, 10);
        });

        it('should return 1 when close from target', (done: MochaDone) => {
            (pSensor.sPort as any).binding.emitData(SENSOR_NEAR_DATA);
            pSensor.once('data', data => {
                try {
                    chai.should().equal(data, 1);
                    done();
                } catch (e) { done(e); }
            });
        });

        it('should return 0 when far from target', (done: MochaDone) => {
            setTimeout(() => {
                (pSensor.sPort as any).binding.emitData(SENSOR_FAR_DATA);
                pSensor.once('data', data => {
                    try {
                        chai.should().equal(data, 0);
                        done();
                    } catch (e) { done(e); }
                });
            }, 10);
        });
    });

    describe('#stop', () => {
        it('should stop read sersor data without error', (done: MochaDone) => {
            pSensor.stop();
            pSensor.once('error', done);
            setTimeout(done, 10);
        });
    });

    describe('#close()', () => {
        it('should close port without error', (done: MochaDone) => {
            pSensor.close();
            pSensor.once('error', done);
            pSensor.once('close', done);
        });
    });

    after(() => MockBinding.reset());

});
