const jwt = require('jsonwebtoken');

function generateRegistrationToken(email) {
    const token = jwt.sign({ email }, 'SECRET', {
        expiresIn: '1h',
    });
    return token;
}

function verifyRegistrationToken(token) {
    try {
        const decoded = jwt.verify(token, 'SECRET');
        return decoded;
    } catch (error) {
        return null; // El token no es válido o ha caducado
    }
}

module.exports = {
    generateRegistrationToken,
    verifyRegistrationToken,
};
