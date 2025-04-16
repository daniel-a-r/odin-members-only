import { Router } from 'express';
import { ExpressValidator, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import db from '../db/queries.js';
import passport from '../config/passportConfig.js';

const { body } = new ExpressValidator({
  isUsernameNotInUse: async (value) => {
    const existingUser = await db.getUserFromUsername(value);
    if (existingUser) {
      throw new Error('Username already taken');
    }
    return true;
  },
  passwordsMatch: (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords must match');
    }
    return true;
  },
});

const validateUserSignUp = [
  body('username')
    .trim()
    .isAlphanumeric()
    .withMessage('Username can only contain letters and numbers')
    .isUsernameNotInUse(),
  body('confirmPassword').passwordsMatch(),
];

const indexRouter = Router();

indexRouter.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

indexRouter
  .route('/sign-up')
  .get((req, res) => {
    res.render('signUp', { title: 'Sign-up' });
  })
  .post(validateUserSignUp, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render('signUp', { title: 'Sign-up', errors: errors.array() });
    }

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
    // console.log(req.session);
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
