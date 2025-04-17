import { Router } from 'express';
import { ExpressValidator, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import db from '../db/queries.js';
import passport from '../config/passportConfig.js';

const { body } = new ExpressValidator({
  isUsernameNotInUse: async (value) => {
    // doesn't need to return true since can be resolved as a promise
    const existingUser = await db.getUserFromUsername(value);
    if (existingUser) {
      throw new Error('Username already taken');
    }
  },
  passwordsMatch: (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords must match');
    }
    // needs to return a boolean value
    return true;
  },
});

const validateUserSignUp = [
  body('username')
    .trim()
    .toLowerCase()
    .isAlphanumeric()
    .withMessage('Username can only contain letters and numbers')
    .isUsernameNotInUse(),
  body('confirmPassword').passwordsMatch(),
];

const validateUserLogin = [
  body('username')
    .trim()
    .toLowerCase()
    .isAlphanumeric()
    .withMessage('Invalid username'),
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
    res.render('login', { title: 'Login', errors: req.session.messages });
  })
  .post(
    validateUserLogin,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // extract error messages from validation errors objects
        const errorMessages = errors.array().map((err) => err.msg);
        return res
          .status(400)
          .render('login', { title: 'Login', errors: errorMessages });
      }
      next();
    },
    (req, res, next) => {
      // clear error messages before authenticating
      req.session.messages = [];
      next();
    },
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
