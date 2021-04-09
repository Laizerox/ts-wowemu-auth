import '../utils/big-integer';

import { BigInteger } from 'jsbn';

const testValues = ['01', '10', '04E8'];

test.each(testValues)('should return same hex as %p', (initialValue: string) => {
    const bigInt = new BigInteger(initialValue, 16);

    expect(bigInt.toHex()).toEqual(initialValue.toLowerCase());
});
