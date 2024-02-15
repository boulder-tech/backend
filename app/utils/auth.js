const jwt = require('jsonwebtoken');

const jwtSecret = strapi.config.get('environments.jwt.secret');

function generateJWT(data) {
  const token = jwt.sign(data, jwtSecret, {
    expiresIn: '24h',
  });

  return token;
}

function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error) {
    return null;
  }
}

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
  generateJWT,
  verifyJWT,
  generateRegistrationToken,
  verifyRegistrationToken,
};
