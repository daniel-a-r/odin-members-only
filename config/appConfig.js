import path from 'node:path';
import express from 'express';
import session from 'express-session';
import passport from './passportConfig.js';

const app = express();

// set view engine
app.set('views', path.resolve('./views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve('./public')));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

export default app;
