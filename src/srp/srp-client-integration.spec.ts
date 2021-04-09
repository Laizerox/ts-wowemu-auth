import HostClient from '../srp/host-client';
import UserClient from '../srp/user-client';

type ClientKnownValues = {
    username: string;
    password: string;
};

type HostKnownValues = {
    salt: string;
    verifier: string;
};

const cases: [ClientKnownValues, HostKnownValues][] = [
    [
        { username: 'admin', password: 'admin' },
        {
            salt: '12ee32e201835ebc6a00c7056f08e18651633ab9cec6cfd5a1bdda413747c74c',
            verifier: '2b25415d6fd90435b9506f64c15e0670bef49a9905d62f21eb573dc4ff2bbaf0',
        },
    ],
    [
        { username: 'player', password: 'player' },
        {
            salt: '50b39832882cc3174f4b566d377775ecc33af5f21fa71bcac58290595101d4e9',
            verifier: '59f9d68f247ff723c46677847e042923184307f652c297726da2868670c607bf',
        },
    ],
];

test.each<[ClientKnownValues, HostKnownValues]>(cases)(
    'both client and host should generate same session key %#',
    (client: ClientKnownValues, host: HostKnownValues) => {
        // 1. Client should generate public ephemeral value A and send username I to host
        const srpUserClient = new UserClient(client.username);
        const A = srpUserClient.getPublicEphemeralValue();

        // 2. Host receives username I and public ephemeral value A.
        const srpHostClient = new HostClient(client.username, host.salt, host.verifier);
        const B = srpHostClient.getPublicEphemeralValue();

        // 3. Client calculates its own session key
        srpUserClient.setSalt(host.salt);
        srpUserClient.setHostPublicEphemeralValue(B);
        srpUserClient.calculateSessionKey(srpUserClient.computePrivateKey(client.password));

        // 4. Client sends proof of its session key to host
        const userSessionProof = srpUserClient.computeClientSessionKeyProof();

        // 5. Host calculates its own session key
        srpHostClient.setClientPublicEphemeralValue(A);
        srpHostClient.calculateSessionKey();

        // 6. Host compares clients proof against its own equivalent client calculated proof
        expect(srpHostClient.validateClientSessionKeyProof(userSessionProof)).toBe(true);

        // 7. Host computes & sends proof of its session key to client
        const hostSessionProof = srpHostClient.computeHostSessionKeyProof(srpHostClient.computeClientSessionKeyProof());

        // 8. Client compares hosts proof against its own equivalent host calculated proof
        expect(srpUserClient.validateHostSessionKeyProof(userSessionProof, hostSessionProof));

        // 9. In theory if both proofs match session keys should be same (These are never exchanged!)
        expect(srpHostClient.getSessionKey()).toEqual(srpUserClient.getSessionKey());
        expect(srpHostClient.getStrongSessionKey()).toEqual(srpUserClient.getStrongSessionKey());
    }
);
