import createHash from 'create-hash';

export const sha1 = (...values: (Buffer | string)[]): Buffer => {
    const hash = createHash('sha1');

    values.forEach((value) => hash.update(value));

    return hash.digest();
};
