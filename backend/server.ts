import express, { request } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import apiRouter from './routes/apiRoutes';
import usersRoutes from './routes/usersRoutes';

const app:express.Application = express();

app.use(cors());
dotenv.config({path:'./.env'});
app.use(express.json());

let hostName:string|undefined = process.env.HOST_NAME;
let port:number|undefined = Number(process.env.PORT);
let db : string|undefined = process.env.MONGODB_URL;

if(db){
    mongoose.connect(db).then(()=>{
        console.log('Connected to db successfully');
    }).catch((error)=>{
        console.error("Error while connecting to db",error);
        process.exit(1);
    });
} else{
    console.log("Please define valid db url");
}

app.get('/',(request:express.Request, response:express.Response)=>{
    response.status(200).json({
        message : 'Server started'
    });
})

app.use('/api',apiRouter);
app.use('/users',usersRoutes);

if(port != undefined && hostName != undefined){
    app.listen(port,hostName,()=>{
        console.log(`Server started at : http://${hostName}:${port}`);
    })
} else{
    console.log('Please define a valid hostname and port number');
}