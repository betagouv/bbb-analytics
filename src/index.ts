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
// app.use((err, req, res, next) => {
//   try {
//     console.log(req.headers.authorization)
//   }
//   catch(e) {
//     console.log('erreur')
//   }
//   if (err.name === 'UnauthorizedError') {
//     console.error(err)
//     // redirect to login and keep the requested url in the '?next=' query param
//     if (req.method === 'GET') {
//       return res.redirect(`/`);
//     }
//   }
//   return next(err);
// });

app.use(
  expressJWT({
    secret: config.secret,
    algorithms: ['HS512'],
    typ: "JWT",
    getToken: function fromHeaderOrQuerystring (req) {
      console.log(req.headers.authorization)
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        console.log('LCS HEADER', req.headers.authorization.split(' ')[1])
          return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
        console.log('LCS HEADER', req.query.token)
        return req.query.token;
      }
      return null;
    }
  }).unless({
    path: [
      '/',
      '/v1/post_events'
    ],
  }),
);

app.use(express.json());

app.get('/', indexController.getIndex);
app.post('/v1/post_events', indexController.postEvents);

module.exports = app.listen(config.port, () => console.log(`Running on port: http://${config.host}:${config.port}`));
