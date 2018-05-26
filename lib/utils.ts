/**
 * Create checksum of data buffer.
 * @param data  Data buffer.
 * @returns     Checksum.
 */
export function createChecksum(data: Buffer): number {
    let check = data[1];
    for (let i = 2; i < 15; i++) {
        /* istanbul ignore else  */
        if (check > data[i]) {
            check = check - data[i];
        } else {
            check = data[i] - check;
        }
    }

    return check;
} // end of createChecksum()


/**
 * Convert HEX to byte of buffer.
 * @param hexValue  HEX value. (e.g. #10)
 * @returns         Byte value.
 */
export function hexToByte(hexValue: number): number {
    if (!hexValue) { return 0; }

    const tmp = [];
    for (let i = 0, len = hexValue.toString().length; i < len; i += 2) {
        tmp.push(parseInt(hexValue.toString().substr(i, 2), 16));
    }
    return +tmp[0];
} // end of hexToByte()
