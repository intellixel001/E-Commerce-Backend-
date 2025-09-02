import express, { Request, Response } from 'express';
import middleware from './app/middleware';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFoundHandler from './app/middleware/notFoundHandler';
import router from './app/routes';
import path from 'node:path';
import config from './app/config';

const app = express();

app.use(middleware);

app.use('/public', express.static(path.join(__dirname, './../public')));
app.use('/api/v1', router);

app.get('/', (_req: Request, res: Response): void => {
    res.status(200).json({
        success: true,
        message: `You're Welcome to My ${config.website_name}💥`,
    });
});

app.use(globalErrorHandler);
app.use(notFoundHandler);

export { app };
