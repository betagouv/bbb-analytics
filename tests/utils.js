const nock = require('nock');
const { Client } = require('pg');
const { parse } = require('pg-connection-string');

const knex = require('../src/db/index');

module.exports = {
  cleanMocks() {
    nock.cleanAll();
    nock.enableNetConnect();
  },
  setupTestDatabase() {
    const dbConfig = parse(process.env.DATABASE_URL);
    const testDbName = dbConfig.database;
    if (!testDbName) return new Error('DATABASE_URL environment variable not set');

    // Postgres needs to have a connection to an existing database in order
    // to perform any request. Since our test database doesn't exist yet,
    // we need to connect to the default database to create it.
    console.log(`Creating test database ${testDbName}...`);
    const temporaryConnection = `postgres://${encodeURIComponent(dbConfig.user)}:${encodeURIComponent(dbConfig.password)}@${encodeURIComponent(dbConfig.host)}:${encodeURIComponent(dbConfig.port)}/bbbanalytics`;
    const client = new Client({ connectionString: temporaryConnection });
    return client.connect()
      .then(() => client.query(`DROP DATABASE IF EXISTS ${testDbName}`, []))
      .then(() => client.query(`CREATE DATABASE ${testDbName}`, []))
      .then(() => client.end())
      .then(() => knex.migrate.latest())
      .then(() => console.log(`Test database ${testDbName} created successfully`))
      .catch((err) => {
        console.log(err);
      });
  },
  cleanUpTestDatabase() {
    const dbConfig = parse(process.env.DATABASE_URL);
    const testDbName = dbConfig.database;
    if (!testDbName) return new Error('DATABASE_URL environment variable not set');

    // Postgres can't remove a database in use, so we will have to
    // connect to the default database to clean up.
    console.log(`Cleaning up test database ${testDbName}...`);
    const temporaryConnection = `postgres://${encodeURIComponent(dbConfig.user)}:${encodeURIComponent(dbConfig.password)}@${encodeURIComponent(dbConfig.host)}:${encodeURIComponent(dbConfig.port)}/bbbanalytics`;
    const client = new Client({ connectionString: temporaryConnection });

    return knex.destroy()
      .then(() => client.connect())
      .then(() => client.query(`DROP DATABASE ${testDbName}`, []))
      .then(() => client.end())
      .then(() => console.log(`Test database ${testDbName} cleaned up successfully`));
  },
};
