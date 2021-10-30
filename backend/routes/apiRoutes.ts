import express, { request } from 'express';

const apiRouter:express.Router = express.Router();

apiRouter.get('/',(request:express.Request, response:express.Response)=>{
    response.status(200).json({
        message : 'Router reached successfully'
    });
});

export default apiRouter;