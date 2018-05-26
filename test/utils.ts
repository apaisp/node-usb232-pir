import * as chai from 'chai';
import { createChecksum, hexToByte } from '../lib/utils';

describe('Utils', () => {

    describe('#hexToByte', () => {
        it('should return 53 when put #35', (done: MochaDone) => {
            try {
                chai.should().equal(hexToByte(35), 53);
                done();
            } catch (err) { done(err); }
        });

        it('should return 0 when put nothing', (done: MochaDone) => {
            try {
                chai.should().equal(hexToByte(undefined), 0);
                done();
            } catch (err) { done(err); }
        });
    });

});
