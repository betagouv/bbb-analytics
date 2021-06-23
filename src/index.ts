require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');
const config = require('./config');

const indexController = require('./controllers/indexController');


const app = express();

// app.use(cookieParser(config.secret));
// app.use(session({ cookie: { maxAge: 300000, sameSite: 'lax' } })); // Only used for Flash not safe for others purposes
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({ extended: false }));

const getJwtTokenForUser = (id) => jwt.sign({ id }, config.secret, { expiresIn: '7 days' });

app.use(async (req, res, next) => {
  if (!req.query.token) return next();

  try {
    return res.redirect(req.path);
  } catch (err) {
    console.log(`Erreur dans l'utilisation du login token : ${err}`);
    return next(err);
  }
});

app.use(
  expressJWT({
    secret: config.secret,
    algorithms: ['HS256'],
    getToken: (req) => req.cookies.token || null,
  }).unless({
    path: [
      '/',
    ],
  }),
);


app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    // redirect to login and keep the requested url in the '?next=' query param
    if (req.method === 'GET') {
      req.flash(
        'error',
        "Vous n'êtes pas identifié pour accéder à cette page (ou votre accès n'est plus valide)",
      );
      return res.redirect(`/`);
    }
  }
  return next(err);
});

app.get('/', indexController.getIndex);
app.post('/v1/post_events', indexController.postEvents);


module.exports = app.listen(config.port, () => console.log(`Running on port: http://${config.host}:${config.port}`));
