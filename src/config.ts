module.exports = {
  secret: process.env.JWT_SECURITY_SALT,
  tagsAndSalts: process.env.JWT_TAGS_AND_SALTS,
  host: process.env.HOSTNAME,
  port: process.env.PORT || 8100,
};
