import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db/queries.js';

const indexRouter = Router();

indexRouter.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

indexRouter.get('/sign-up', (req, res) => {
  res.render('sign-up', { title: 'Sign-up' });
});

indexRouter.post('/sign-up', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    await db.insertUser(username, hashPassword);
    res.redirect('/');
  } catch (err) {
    console.error(err);
  }
});

export default indexRouter;
