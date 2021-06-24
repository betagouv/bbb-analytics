const isSecure = (process.env.SECURE || 'true') === 'true';

module.exports = {
  secret: process.env.SESSION_SECRET,
  secure: isSecure,
  protocol: isSecure ? 'https' : 'http',
  host: process.env.HOSTNAME,
  port: process.env.PORT || 8100,
};
