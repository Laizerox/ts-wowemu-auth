## Installing

Using npm:

```bash
$ npm install ts-wowemu-auth
```

Using yarn:

```bash
$ yarn add ts-wowemu-auth
```

## Example for registering new users
In order to register new users we need to generate salt and verifier.

To acquire new salt for user you will need to create `UserClient` instance and invoked `generateSalt` function.
Salt generation step is very important because verifier generation cannot be executed without it.

Now you can send salt and verifier to your backend process to complete registration.

```js
import { UserClient } from 'ts-wowemu-auth'

const client = new UserClient('username-from-form');
const salt = client.generateSalt();
const verifier = client.generateVerifier('password-from-form');
```
