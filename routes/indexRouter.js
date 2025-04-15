import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db/queries.js';
import passport from '../config/passportConfig.js';

const indexRouter = Router();

indexRouter.get('/', (req, res) => {
  console.log({ user: req.user });
  res.render('index', { title: 'Home', currentUser: req.user });
});

indexRouter
  .route('/sign-up')
  .get((req, res) => {
    res.render('sign-up', { title: 'Sign-up' });
  })
  .post(async (req, res) => {
    const { username, password } = req.body;
    try {
      const hashPassword = await bcrypt.hash(password, 10);
      await db.insertUser(username, hashPassword);
      res.redirect('/');
    } catch (err) {
      console.error(err);
    }
  });

indexRouter
  .route('/login')
  .get((req, res) => {
    console.log(req.session);
    res.render('login', { title: 'Login' });
  })
  .post(
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureMessage: true,
    }),
  );

indexRouter.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

export default indexRouter;
