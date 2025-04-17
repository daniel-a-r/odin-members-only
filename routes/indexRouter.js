import { Router } from 'express';
import * as controller from '../controllers/indexController.js';

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

indexRouter
  .route('/new-message')
  .get(controller.newMessageGet)
  .post(controller.newMessagePost);

indexRouter.post('/:messageId', controller.messageIdPost);

export default indexRouter;
