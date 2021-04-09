import { BigInteger } from 'jsbn';

import UserClient from '../srp/user-client';
import { User, users } from '../test-data/user-data';

const createTestUserClient = (username: string, salt?: string, secretEphemeralValue?: string) => {
    class TestUserClient extends UserClient {
        protected getRandomNumber(length: number): string {
            if (secretEphemeralValue === undefined) {
                return super.getRandomNumber(length);
            }

            return secretEphemeralValue;
        }
    }

    return new TestUserClient(username, salt);
};

describe('When executing UserClient calculateSessionKey function it', () => {
    it.each(users)('should generate expected session key with pre-defined values for case %#', (user: User) => {
        const client = createTestUserClient(user.username, user.salt, user.userClientPrivateEphemeralValue);

        client.getPublicEphemeralValue();
        client.setHostPublicEphemeralValue(user.hostClientPublicEphemeralValue);
        client.calculateSessionKey(client.computePrivateKey(user.password));

        expect(client.getSessionKey()).toEqual(user.sessionKey);
        expect(client.getStrongSessionKey()).toEqual(user.strongSessionKey);
    });

    it('should throw an error on missing hostPublicEphemeralValue', () => {
        const [first] = users[0];
        const client = createTestUserClient(first.username, first.salt);

        client.getPublicEphemeralValue();

        expect(() => client.calculateSessionKey(client.computePrivateKey(first.password))).toThrow(
            'Could not calculate session key because of uninitialized values'
        );
    });

    it('should throw an error on missing secretEphemeralValue', () => {
        const [first] = users[0];
        const client = createTestUserClient(first.username, first.salt);

        client.setHostPublicEphemeralValue(first.hostClientPublicEphemeralValue);

        expect(() => client.calculateSessionKey(client.computePrivateKey(first.password))).toThrow(
            'Could not calculate session key because of uninitialized values'
        );
    });
});

describe('When executing UserClient computePrivateKey function it', () => {
    it.each(users)('should generate expected private key for case %#', (user: User) => {
        const client = new UserClient(user.username, user.salt);

        expect(client.computePrivateKey(user.password)).toEqual(new BigInteger(user.privateKey, 16));
    });

    it('should throw an error on missing username', () => {
        const client = createTestUserClient('');

        expect(() => client.computePrivateKey('password')).toThrow('Cannot compute private key without username');
    });

    it('should throw an error on missing username', () => {
        const client = createTestUserClient('username');

        expect(() => client.computePrivateKey('password')).toThrow('Cannot compute private key without salt');
    });
});

test('UserClient should have identical salt store in class that was returned', () => {
    const client = createTestUserClient('admin');
    const salt = client.generateSalt();

    expect(client.getSalt()).toEqual(salt);
});

describe('When executing UserClient generateVerifier function it', () => {
    it.each(users)('should generate expected verifier for case %# salt', (user: User) => {
        const client = createTestUserClient(user.username, user.salt);

        expect(client.generateVerifier(user.password)).toEqual(user.verifier);
    });
});

describe('When executing setHostPublicEphemeralValue it', () => {
    const [first] = users[0];
    const client = createTestUserClient(first.username, first.salt);

    it('should succeed on valid value', () => {
        expect(() => client.setHostPublicEphemeralValue(first.hostClientPublicEphemeralValue)).not.toThrow();
    });

    it('should fail on invalid value', () => {
        expect(() =>
            client.setHostPublicEphemeralValue('894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7')
        ).toThrow();
    });

    it('should fail on zero value', () => {
        expect(() => client.setHostPublicEphemeralValue('0')).toThrow();
    });
});
