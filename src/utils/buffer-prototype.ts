declare global {
    interface Buffer {
        toHex(): string;
    }
}

Buffer.prototype.toHex = function () {
    return this.toString('hex');
};

export {};
