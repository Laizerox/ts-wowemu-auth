import HostClient from '../srp/host-client';
import { User, users } from '../test-data/user-data';

const createTestHostClient = (username: string, salt: string, verifier: string, secretEphemeralValue?: string) => {
    class TestHostClient extends HostClient {
        protected getRandomNumber(length: number): string {
            if (secretEphemeralValue === undefined) {
                return super.getRandomNumber(length);
            }

            return secretEphemeralValue;
        }
    }

    return new TestHostClient(username, salt, verifier);
};

describe('When executing HostClient calculateSessionKey function it', () => {
    it.each(users)('should generate expected session key with pre-defined values for case %#', (user: User) => {
        const client = createTestHostClient(
            user.username,
            user.salt,
            user.verifier,
            user.hostClientPrivateEphemeralValue
        );

        client.getPublicEphemeralValue();
        client.setClientPublicEphemeralValue(user.userClientPublicEphemeralValue);
        client.calculateSessionKey();

        expect(client.getSessionKey()).toEqual(user.sessionKey);
        expect(client.getStrongSessionKey()).toEqual(user.strongSessionKey);
    });

    it('should throw an error on missing hostPublicEphemeralValue', () => {
        const [first] = users[0];
        const client = createTestHostClient(first.username, first.salt, first.verifier);

        client.getPublicEphemeralValue();

        expect(() => client.calculateSessionKey()).toThrow(
            'Could not calculate session key because of uninitialized values'
        );
    });

    it('should throw an error on missing secretEphemeralValue', () => {
        const [first] = users[0];
        const client = createTestHostClient(first.username, first.salt, first.verifier);

        client.setClientPublicEphemeralValue(first.userClientPublicEphemeralValue);

        expect(() => client.calculateSessionKey()).toThrow(
            'Could not calculate session key because of uninitialized values'
        );
    });
});

describe('When executing setHostPublicEphemeralValue it', () => {
    const [first] = users[0];
    const client = createTestHostClient(first.username, first.salt, first.verifier);

    it('should succeed on valid value', () => {
        expect(() => client.setClientPublicEphemeralValue(first.userClientPublicEphemeralValue)).not.toThrow();
    });

    it('should fail on invalid value', () => {
        expect(() =>
            client.setClientPublicEphemeralValue('894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7')
        ).toThrow();
    });

    it('should fail on zero value', () => {
        expect(() => client.setClientPublicEphemeralValue('0')).toThrow();
    });
});
