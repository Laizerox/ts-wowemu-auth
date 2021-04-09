import * as jsbn from 'jsbn';

declare module 'jsbn' {
    interface BigInteger {
        toHex(): string;
    }
}

jsbn.BigInteger.prototype.toHex = function () {
    const value = this.toString(16);

    return value.length % 2 === 0 ? value : '0' + value;
};

export {};
