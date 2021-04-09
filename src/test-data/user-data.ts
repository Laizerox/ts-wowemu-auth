export type User = {
    hostClientPrivateEphemeralValue: string;
    hostClientPublicEphemeralValue: string;
    password: string;
    privateKey: string;
    salt: string;
    sessionKey: string;
    strongSessionKey: string;
    userClientPrivateEphemeralValue: string;
    userClientPublicEphemeralValue: string;
    username: string;
    verifier: string;
};

export const users: [User][] = [
    [
        {
            hostClientPrivateEphemeralValue: 'd5e3b01f32f6eed10d8e3ffb98f28b95',
            hostClientPublicEphemeralValue: '1a2c14b19e398f2111cd213396d3330f977ab1480f66267f366a6363234b2dc4',
            password: 'admin',
            privateKey: 'bd037a6568827250f8aeaf68f6d44e8d66f16099',
            salt: '12ee32e201835ebc6a00c7056f08e18651633ab9cec6cfd5a1bdda413747c74c',
            sessionKey: '8609e42d5e0a6536518a813d2643828ddf865b503edf22cdef8564257ca27159',
            strongSessionKey: '96bf146c2b255acc8ecfa23f0eda62d346c38b55',
            userClientPrivateEphemeralValue: 'e49bbcf11482262ab646feb4c554c196',
            userClientPublicEphemeralValue: '302c1d305234a8a5a9c4f1d19d0e4bb5b9cc8eb22a9f9b0bee84377f4f81da1b',
            username: 'admin',
            verifier: '2b25415d6fd90435b9506f64c15e0670bef49a9905d62f21eb573dc4ff2bbaf0',
        },
    ],
    [
        {
            hostClientPrivateEphemeralValue: 'e3e3857e776cd492a9eee909a4c851bd',
            hostClientPublicEphemeralValue: '46120ea02021bf8bc341db28a7689a144c930d41dd1af01902e90f0dc9edeb50',
            password: 'player',
            privateKey: '9aa76c4e2f9dc15376015237d6e3f8f2cc5a6eea',
            salt: '50b39832882cc3174f4b566d377775ecc33af5f21fa71bcac58290595101d4e9',
            sessionKey: '0e2bb0ed0013c9667ee49d44ab18a673984e64365ea396070a902e2dff087a64',
            strongSessionKey: '45dbf48bcd6f19b70b2f5a1c36028036a5d15d9d',
            userClientPrivateEphemeralValue: 'c523f41eca9ef2bea5d7ce256bcf7bb2',
            userClientPublicEphemeralValue: '68cd4421126126e092a05ef1267d799e79ed772e5e10e06d82a1e6c6df1b3326',
            username: 'player',
            verifier: '59f9d68f247ff723c46677847e042923184307f652c297726da2868670c607bf',
        },
    ],
];
