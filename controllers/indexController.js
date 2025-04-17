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

export const indexGet = async (req, res) => {
  try {
    if (req.user) {
      let messages;
      if (req.user.member) {
        messages = await db.getAllMessagesAsMember();
      } else {
        messages = await db.getAllMessagesAsNonMember();
      }
      return res.render('index', { title: 'Home', messages });
    }
    res.render('index', { title: 'Home' });
  } catch (error) {
    console.error(error);
  }
};

export const signUpGet = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('signUp', { title: 'Sign-up' });
};

const validateSignUp = [
  body('username')
    .trim()
    .toLowerCase()
    .isAlphanumeric()
    .withMessage('Username can only contain letters and numbers')
    .isUsernameNotInUse(),
  body('confirmPassword').passwordsMatch(),
];

const checkSignUpValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .render('signUp', { title: 'Sign-up', errors: errors.array() });
  }
  next();
};

const createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    await db.insertUser(username, hashPassword);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
  }
};

export const signUpPost = validateSignUp.concat(
  checkSignUpValidationErrors,
  createUser,
);

export const loginGet = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('login', { title: 'Login', errors: req.session.messages });
};

const validateLogin = [
  body('username')
    .trim()
    .toLowerCase()
    .isAlphanumeric()
    .withMessage('Invalid username'),
];

const checkLoginValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // extract error messages from validation errors objects
    const errorMessages = errors.array().map((err) => err.msg);
    return res
      .status(400)
      .render('login', { title: 'Login', errors: errorMessages });
  }
  next();
};

const clearSessionMessages = (req, res, next) => {
  // clear error messages before authenticating
  req.session.messages = [];
  next();
};

const authenticate = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage: true,
});

export const loginPost = validateLogin.concat(
  checkLoginValidationErrors,
  clearSessionMessages,
  authenticate,
);

export const logoutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

export const joinGet = (req, res) => {
  if (!req.user) {
    return res.status(401).redirect('/login');
  }

  if (req.user.member) {
    return res.redirect('/');
  }

  res.render('join', { title: 'Become a member' });
};

export const joinPost = async (req, res) => {
  if (req.body.password !== process.env.MEMBERSHIP_PW) {
    return res.redirect('/join');
  }

  try {
    await db.updateUserMembershipFromId(req.user.id);
    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
};

export const newMessageGet = (req, res) => {
  if (!req.user) {
    return res.status(401).redirect('/login');
  }

  res.render('newMessage', { title: 'Create a new message' });
};

export const newMessagePost = async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  const { subject, content } = req.body;
  const timestamp = new Date(req.params.timestamp);
  try {
    await db.insertMessage(subject, content, timestamp, req.user.id);
    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
};

export const messageIdPost = async (req, res) => {
  try {
    await db.deleteMessageFromId(req.params.messageId);
    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
};
