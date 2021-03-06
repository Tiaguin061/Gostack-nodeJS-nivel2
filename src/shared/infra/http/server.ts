import 'reflect-metadata';
import 'dotenv/config'
import express, { Request, Response, NextFunction} from 'express';
import cors from 'cors';
import { errors } from 'celebrate/';

import 'express-async-errors';

import routes from '@shared/infra/http/routes';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

import '@shared/infra/typeorm';
import '@shared/container';
import rateLimiter from '../middlewares/rateLimiter';

const app = express();

app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);
app.use(errors());

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if(err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    te: err.stack,
    message: 'Internal server error.'
  });
});

const port = 3333;
app.listen(port, () => {
  console.log(`Server stated on port ${port}`)
});