import '../utils/big-integer';
import '../utils/buffer-prototype';

import { BigInteger } from 'jsbn';
import randomBytes from 'randombytes';

import { sha1 } from '../utils/sha1';

export interface ClientOptions {
    g: BigInteger;
    N: BigInteger;
}

const defaultClientOptions: ClientOptions = {
    g: new BigInteger('07', 16),
    N: new BigInteger('894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7', 16),
};

export abstract class Client {
    /**
     * @var {BigInteger} Local public ephemeral value
     */
    protected clientPublicEphemeralValue: BigInteger | null = null;

    /**
     * @var {BigInteger} A generator modulo N
     */
    protected g: BigInteger;

    /**
     * @var {BigInteger} Remote public ephemeral value
     */
    protected hostPublicEphemeralValue: BigInteger | null = null;

    /**
     * @var BigInteger Multiplier parameter (K)
     */
    protected multiplier: BigInteger;

    /**
     * @var BigInteger A large safe prime
     */
    protected N: BigInteger;

    /**
     * @var string User's salt
     */
    protected salt: string | undefined;

    /**
     * @var BigInteger Local secret ephemeral value
     */
    protected secretEphemeralValue: BigInteger | null = null;

    /**
     * @var BigInteger Computed session key
     */
    protected sessionKey: BigInteger | null = null;

    /**
     * @var string Hashed session key
     */
    protected strongSessionKey: string | undefined;

    /**
     * @var string User's username (I)
     */
    protected username: string;

    /**
     * SRP Client constructor.
     *
     * @param {string}          identity User's identity (username)
     * @param {string}          salt     User's salt
     * @param {ClientOptions}   options  Various options for SRP Client
     */
    protected constructor(identity: string, salt?: string, options?: Partial<ClientOptions>) {
        this.g = (options && options['g']) || defaultClientOptions['g'];
        this.multiplier = new BigInteger('03', 16);
        this.N = (options && options['N']) || defaultClientOptions['N'];
        this.salt = salt;
        this.username = identity;
    }

    /**
     * @return string
     */
    public computeClientSessionKeyProof(): string {
        if (
            !this.clientPublicEphemeralValue ||
            !this.hostPublicEphemeralValue ||
            !this.salt ||
            !this.strongSessionKey
        ) {
            throw new Error();
        }

        const A = this.clientPublicEphemeralValue.toHex();
        const B = this.hostPublicEphemeralValue.toHex();
        const I = sha1(this.username);
        const K = this.strongSessionKey;
        const s = this.salt;

        const N = sha1(this.N.toHex());
        const g = sha1(this.g.toHex());
        const Ng = Buffer.from(N.map((value: number, idx: number) => value ^ g[idx])).toString();

        return sha1(Ng, I, s, A, B, K).toHex();
    }

    /**
     * @param  {string}  M  User's calculated proof of session
     *
     * @return string
     */
    public computeHostSessionKeyProof(M: string): string {
        if (!this.clientPublicEphemeralValue || !this.strongSessionKey) {
            throw new Error();
        }

        return sha1(this.clientPublicEphemeralValue.toHex(), M, this.strongSessionKey).toHex();
    }

    /**
     * @param  {BigInteger}  value  Secret ephemeral value
     *
     * @return BigInteger Public ephemeral value
     */
    protected abstract computePublicEphemeralValue(value: BigInteger): BigInteger;

    /**
     * @return BigInteger Random scrambling parameter
     */
    public computeRandomScramblingParameter(): BigInteger {
        if (!this.clientPublicEphemeralValue || !this.hostPublicEphemeralValue) {
            throw new Error('Could not compute random scrambling parameter due to uninitialized values');
        }

        return new BigInteger(
            sha1(this.clientPublicEphemeralValue.toHex(), this.hostPublicEphemeralValue.toHex()).toHex(),
            16
        );
    }

    /**
     * @return BigInteger
     * @throws Exception
     */
    public generateSecretEphemeralValue(): BigInteger {
        return new BigInteger(this.getRandomNumber(16), 16);
    }

    /**
     * Returns hex of public ephemeral value
     *
     * @return string
     */
    public abstract getPublicEphemeralValue(): string;

    public getSalt(): string | undefined {
        return this.salt;
    }

    /**
     * @return string
     */
    public getSessionKey(): string {
        if (!this.sessionKey) {
            throw new Error();
        }

        return this.sessionKey.toHex();
    }

    /**
     * @return string
     */
    public getStrongSessionKey(): string {
        if (!this.strongSessionKey) {
            throw new Error();
        }

        return this.strongSessionKey;
    }

    /**
     * Sets user's salt
     *
     * @param {string} salt
     */
    public setSalt(salt: string): void {
        this.salt = salt;
    }

    /**
     * Generates both private and public ephemeral values but returns only public value
     *
     * @return BigInteger
     * @throws Exception
     */
    protected generateEphemeralValues(): BigInteger {
        let publicValue: BigInteger | null = null;
        let secretValue: BigInteger | null = null;

        while (!publicValue || publicValue.mod(this.N).intValue() === 0) {
            secretValue = this.generateSecretEphemeralValue();
            publicValue = this.computePublicEphemeralValue(secretValue);
        }

        this.secretEphemeralValue = secretValue;

        return publicValue;
    }

    /**
     * Generate hex string of defined length of random bytes
     *
     * @param  {number}  length
     *
     * @return string
     * @throws Exception
     */
    protected getRandomNumber(length: number): string {
        return randomBytes(length).toHex();
    }
}

export default Client;
