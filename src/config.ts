const isSecure = (process.env.SECURE || 'true') === 'true';

module.exports = {
  secret: process.env.JWT_SECURITY_SALT,
  secure: isSecure,
  protocol: isSecure ? 'https' : 'http',
  host: process.env.HOSTNAME,
  port: process.env.PORT || 8100,
};
