const { genSalt, hash, compare } = require('bcrypt');
const { SALT, SIGNATURE } = process.env;

async function hashObject(objectToHash) {
    const salt = await genSalt(Number(SALT));
    return await hash(objectToHash, salt);
}