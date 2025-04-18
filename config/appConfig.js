import path from 'node:path';
import express from 'express';
import session from 'express-session';
import passport from './passportConfig.js';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './dbConfig.js';

const app = express();

// set view engine
app.set('views', path.resolve('./views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve('./public')));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new (connectPgSimple(session))({
      pool: pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  }),
);
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

export default app;
