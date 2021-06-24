require('dotenv').config();

module.exports = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL,
  migrations: {
    tableName: 'migrations',
  },
  seeds: {
    directory: './tests/seed',
  },
};
