import { Router } from 'express';
import controller from '../controllers/indexController.js';

const indexRouter = Router();

indexRouter.get('/', controller.indexGet);

indexRouter
  .route('/sign-up')
  .get(controller.signUpGet)
  .post(controller.signUpPost);

// prettier-ignore
indexRouter
  .route('/login')
  .get(controller.loginGet)
  .post(controller.loginPost);

indexRouter.get('/logout', controller.logoutGet);

// prettier-ignore
indexRouter
  .route('/join')
  .get(controller.joinGet)
  .post(controller.joinPost);

indexRouter.get('/new-message', controller.newMessageGet);
indexRouter.post('/new-message/:timestamp', controller.newMessagePost);

indexRouter.post('/delete/:messageId', controller.messageIdPost);

export default indexRouter;
