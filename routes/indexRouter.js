import { Router } from 'express';

const indexRouter = Router();

indexRouter.get('/', (req, res) => {
  res.send('hello world');
});

export default indexRouter;
