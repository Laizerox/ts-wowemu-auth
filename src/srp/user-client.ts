import '../utils/big-integer';
import '../utils/buffer-prototype';

import { BigInteger } from 'jsbn';

import { sha1 } from '../utils/sha1';
import Client, { ClientOptions } from './client';

export class UserClient extends Client {
    public constructor(identity: string, salt?: string, options?: Partial<ClientOptions>) {
        super(identity, salt, options);
    }

    public calculateSessionKey(privateKey: BigInteger): void {
        if (!this.hostPublicEphemeralValue || !this.secretEphemeralValue) {
            throw new Error('Could not calculate session key because of uninitialized values');
        }

        // Random scrambling parameter
        const u = this.computeRandomScramblingParameter();
        const v = this.computeVerifier(privateKey);
        const kv = this.multiplier.multiply(v);
        const aux = this.secretEphemeralValue.add(u.multiply(privateKey));

        // Session key
        this.sessionKey = this.hostPublicEphemeralValue.subtract(kv).modPow(aux, this.N);

        // Strong session key
        this.strongSessionKey = sha1(this.sessionKey.toHex()).toHex();
    }

    public computePrivateKey(password: string): BigInteger {
        if (!this.username) {
            throw new Error('Cannot compute private key without username');
        }

        if (!this.salt) {
            throw new Error('Cannot compute private key without salt');
        }

        const salt = Buffer.from(this.salt, 'hex').reverse();
        const identity = sha1(this.username.toUpperCase(), ':', password.toUpperCase());
        const sha = sha1(salt, identity).reverse();

        return new BigInteger(sha.toHex(), 16);
    }

    public generateSalt(): string {
        return (this.salt = this.getRandomNumber(32));
    }

    public generateVerifier(password: string): string {
        const privateKey = this.computePrivateKey(password);
        const verifier = this.computeVerifier(privateKey);

        return verifier.toHex();
    }

    public getPublicEphemeralValue(): string {
        this.clientPublicEphemeralValue = this.generateEphemeralValues();

        return this.clientPublicEphemeralValue.toHex();
    }

    public setHostPublicEphemeralValue(value: string): void {
        const hostPublicEphemeralValue = new BigInteger(value, 16);
        if (hostPublicEphemeralValue.mod(this.N).intValue() === 0) {
            throw new Error('Received invalid public ephemeral value from host');
        }

        this.hostPublicEphemeralValue = new BigInteger(value, 16);
    }

    public validateHostSessionKeyProof(M: string, proof: string): boolean {
        return this.computeHostSessionKeyProof(M) === proof;
    }

    protected computePublicEphemeralValue(value: BigInteger): BigInteger {
        return this.g.modPow(value, this.N);
    }

    private computeVerifier(privateKey: BigInteger): BigInteger {
        return this.g.modPow(privateKey, this.N);
    }
}

export default UserClient;
