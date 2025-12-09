const jwt = require('jsonwebtoken');

function signAccess(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}
function signRefresh(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}
function verify(token, secret=process.env.JWT_SECRET){
  return jwt.verify(token, secret);
}

module.exports = { signAccess, signRefresh, verify };
