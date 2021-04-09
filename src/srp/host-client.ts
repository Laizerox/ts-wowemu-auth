import '../utils/big-integer';
import '../utils/buffer-prototype';

import { BigInteger } from 'jsbn';

import { sha1 } from '../utils/sha1';
import Client, { ClientOptions } from './client';

export class HostClient extends Client {
    private verifier: BigInteger;

    public constructor(identity: string, salt: string, verifier: string, options?: Partial<ClientOptions>) {
        super(identity, salt, options);

        this.verifier = new BigInteger(verifier, 16);
    }

    public calculateSessionKey(): void {
        if (!this.clientPublicEphemeralValue || !this.secretEphemeralValue) {
            throw new Error('Could not calculate session key because of uninitialized values');
        }

        // Random scrambling parameter
        const u = this.computeRandomScramblingParameter();
        const avu = this.clientPublicEphemeralValue.multiply(this.verifier.modPow(u, this.N));

        // Session key
        this.sessionKey = avu.modPow(this.secretEphemeralValue, this.N);

        // Strong session key
        this.strongSessionKey = sha1(this.sessionKey.toHex()).toHex();
    }

    public getPublicEphemeralValue(): string {
        this.hostPublicEphemeralValue = this.generateEphemeralValues();

        return this.hostPublicEphemeralValue.toHex();
    }

    public setClientPublicEphemeralValue(value: string): void {
        const clientPublicEphemeralValue = new BigInteger(value, 16);
        if (clientPublicEphemeralValue.mod(this.N).intValue() === 0) {
            throw new Error('Received invalid public ephemeral value from user');
        }

        this.clientPublicEphemeralValue = new BigInteger(value, 16);
    }

    public validateClientSessionKeyProof(proof: string): boolean {
        return this.computeClientSessionKeyProof() === proof;
    }

    protected computePublicEphemeralValue(value: BigInteger): BigInteger {
        return this.multiplier.multiply(this.verifier).add(this.g.modPow(value, this.N)).mod(this.N);
    }
}

export default HostClient;
