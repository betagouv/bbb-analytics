require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const expressSanitizer = require('express-sanitizer');
const config = require('./config');

const indexController = require('./controllers/indexController');

const app = express();

app.use(expressSanitizer());
app.use(bodyParser.urlencoded({ extended: false }));

const getSecretForTag = function(req, payload, done){
  const { tag } = req.query;

  // fallback to the default JWT_SECURITY_SALT if the new variable isn't set up
  if (!config.tagsAndSalts) {
    done(null, config.secret);
    return;
  }

  const issuer = config
    .tagsAndSalts
    .split(",")
    .map(i => i.split(":"))
    .find(([t]) => t === tag);

  if (!issuer) throw new Error(`No matching issuer was found for tag '${tag}'.`)

  const [, secret] = issuer;

  done(null, secret);
}

app.use(
  expressJWT({
    secret: getSecretForTag,
    algorithms: ['HS512'],
    typ: "JWT",
  }),
  function(err, req, res, next) {
    if (err) {
      res.status(403).send('No matching issuer was found');
    } else {
      next();
    }
  },
);

app.use(express.json());
app.post('/v1/post_events', indexController.postEvents);

module.exports = app.listen(config.port, () => console.log(`Running on port: http://${config.host}:${config.port}`));
