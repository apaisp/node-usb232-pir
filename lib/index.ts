import * as EventEmitter from 'events';
import * as SerialPort from 'serialport';
import { createChecksum, hexToByte } from './utils';

/**
 * PIR sensor configuration.
 */
export interface PirSensorConfig {
    /** Automatically opens the port and read sensor data. */
    autoRead?: boolean;
    /** Custom serial port module. Ref: https://github.com/node-serialport/node-serialport */
    customSerialPortModule?: typeof SerialPort;
}

/**
 * Get event from PIR sensor.
 */
export default class PirSensor extends EventEmitter {
    /** Serial port. */
    sPort: SerialPort;
    /** Is serial port on test mode? */
    private CustomSerialPort: typeof SerialPort;
    /** Serial port path. */
    private SPORT_PATH: string;
    /** Open and read serial port automatically? */
    private IS_SPORT_AUTOREAD: boolean;
    /** Buffer for receiving data. */
    private dataBuffer: Buffer = new Buffer('');

    /**
     * @property {string} portPath Port path.
     * @property {PirSensorConfig} config PIR sensor configuration.
     */
    constructor(portPath: string, config: PirSensorConfig = { autoRead: true }) {
        super();
        this.SPORT_PATH = portPath;  // Set port path.
        this.IS_SPORT_AUTOREAD = config.autoRead;
        this.CustomSerialPort = config.customSerialPortModule;

        this.initSerialPort();
    }

    /**
     * Initialize serial port of PIR sensor.
     */
    private async initSerialPort() {
        // Import module dynamically.
        this.sPort = new (
            /* istanbul ignore next */
            this.CustomSerialPort ?
                this.CustomSerialPort :
                /* istanbul ignore next */
                await import('serialport')
        )(this.SPORT_PATH, {
            autoOpen: this.IS_SPORT_AUTOREAD,
            baudRate: 9600
        });

        // Events of serial port.
        this.sPort.on('open', err => this.emit('open', err));
        this.sPort.on('close', err => this.emit('close', err));
        this.sPort.on('error', err => this.emit('error', err));
        this.sPort.on('data', (revBuffer: Buffer) => {
            this.dataBuffer = Buffer.concat([this.dataBuffer, revBuffer]);
            if (this.dataBuffer.length >= 16) {
                const result = this.dataBuffer[4];
                this.emit('data', result);
                this.dataBuffer = new Buffer('');  // Empty buffer.
            }
        });

        if (this.IS_SPORT_AUTOREAD) {
            this.read();
        }
    } // end of initSerialPort()


    /**
     * Send requset to PIR sensor.
     * @param todo  Task to do.
     */
    private sendRequest(todo: 'READ' | 'READ_ONCE' | 'STOP') {
        const data: Buffer = Buffer.alloc(16).fill(0);  // Create 16 byte buffer.
        data[0] = hexToByte(10);
        data[1] = hexToByte(36);
        data[2] = hexToByte(1);
        data[3] = hexToByte((() => {
            switch (todo) {
                case 'READ': return 1;
                case 'READ_ONCE': return 2;
                default: return 3;
            }
        })());
        data[15] = createChecksum(data);
        this.sPort.write(data);
    } // end of sendRequest()


    /**
     * Open PIR sensor connection.
     */
    open() {
        this.sPort.open();
    } // end of open()


    /**
     * Close PIR sensor connection.
     */
    close() {
        this.sPort.close();
    } // end of close()


    /**
     * Read PIR sensor state.
     */
    read() {
        this.sendRequest('READ');
    } // end of read()


    /**
     * Read PIR sensor state once.
     */
    readOnce() {
        this.sendRequest('READ_ONCE');
    } // end of readOnce()


    /**
     * Stop read PIR sensor state.
     */
    stop() {
        this.sendRequest('STOP');
    } // end of stop()
}
