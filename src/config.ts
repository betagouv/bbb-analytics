module.exports = {
  secret: process.env.JWT_SECURITY_SALT,
  host: process.env.HOSTNAME,
  port: process.env.PORT || 8100,
};
