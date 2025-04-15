import { body, validationResult } from 'express-validator';
import passportLocal from 'passport-local';
import app from './config/appConfig.js';
import indexRouter from './routes/indexRouter.js';

const PORT = process.env.PORT || 3000;

app.use('/', indexRouter);

app.listen(PORT, () => console.log(`Express app listening on port ${PORT}`));
