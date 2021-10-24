import express, { request } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app:express.Application = express();

app.use(cors());
dotenv.config({path:'./.env'});
app.use(express.json());

let hostName:string|undefined = process.env.HOST_NAME;
let port:number|undefined = Number(process.env.PORT);

app.get('/',(request:express.Request, response:express.Response)=>{
    response.status(200).json({
        message : 'Server started'
    });
})

if(port != undefined && hostName != undefined){
    app.listen(port,hostName,()=>{
        console.log(`Server started at : http://${hostName}:${port}`);
    })
}