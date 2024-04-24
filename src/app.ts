// ========================================================
// Set up database and express server
import * as express from 'express';
import 'reflect-metadata';
import databaseInitialize from './app-data-src';
import 'module-alias/register';

const app = express();
const port = 3000;
app.use(express.json());

const startServer = async () => {
    try {
        await databaseInitialize();

        app.listen(port, () => {
            console.log(`[Server] Server is running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error('[Database] Error: ', err);
    }
};

startServer();

// ========================================================
// Set up routes
import router from './routes';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE } from '@/utils/returnCode';
import * as jwt from 'jsonwebtoken';

const whitelist = [
    '/api/accounts/sign-in', 
    '/api/accounts/sign-up', 
    '/api/accounts/auth-google',
    '/api/otp',
    '/api/otp/verification',
    '/api/files'
];

// Middleware to check JWT token
app.use((req: Request, res: Response, next) => {
    // Check if route is in whitelist
    if (whitelist.find((path) => req.originalUrl.includes(path))) {
        next();
        return;
    }

    const token = req.headers['x-access-token'];
    
    // Check if token is provided
    if (!token) {
        const response = new BaseResponse(RET_CODE.UNAUTHORIZED, false, 'No token provided');
        res.json(response.getResponse());
        return;
    }

    // Check if token is not expired
    jwt.verify(token as string, process.env.JWT_SECRET, (err: any) => {
        if (err) {
            const response = new BaseResponse(RET_CODE.UNAUTHORIZED, false, 'Token expired');
            res.json(response.getResponse());
        } else {
            next();
        }
    });
});

app.use('/', router);
