import express, { request } from 'express';
import { body, validationResult } from 'express-validator';
import { users } from '../database/models/users';
import userModel from '../database/schemas/usersSchema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import tokenVerifier from '../middleware/tokenVerifier';

const usersRoutes: express.Router = express.Router();

usersRoutes.get('/', tokenVerifier, async (request: express.Request, response: express.Response) => {
   try {
       let requestedUser:any =request.headers['user'];
       let user:users|null = await userModel.findById(requestedUser.id).select('-password');
       if(user){
        return response.status(200).json({
            user:user
        })
       } else{
           return response.status(400).json({
               errors : [
                   {
                       message : "User not found"
                   }
               ]
           })
       }
   } catch (error) {
       console.error(error);
       
   }
});

usersRoutes.post('/register', [
    body('userName').notEmpty().withMessage('userName is required'),
    body('password').notEmpty().withMessage('password is required'),
], async (request: express.Request, response: express.Response) => {
    let errors = validationResult(request);
    if (errors.isEmpty()) {
        try {
            let { userName, password } = request.body;
            let user: users | null = await userModel.findOne({ userName: userName });
            if (user) {
                return response.status(400).json({
                    errors: [
                        { messgae: 'User with same user name already exsists' }
                    ]
                });
            } else {
                let salt = await bcrypt.genSalt(10);
                password = await bcrypt.hash(password, salt);
                user = new userModel({ userName, password});
                user = await user.save();
                return response.status(200).json({
                    message: 'User registered successfully'
                })
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        return response.status(400).json({
            errors: errors.array()
        });
    }
});

usersRoutes.post('/login', [
    body('userName').notEmpty().withMessage('userName is required'),
    body('password').notEmpty().withMessage('password is required'),
], async (request: express.Request, response: express.Response) => {
    let errors = validationResult(request);
    if (errors.isEmpty()) {
        let { userName, password } = request.body;
        let user: users | null = await userModel.findOne({ userName: userName });
        if (user) {
            let isMatch: boolean = await bcrypt.compare(password, user.password);
            if (isMatch) {
                if(process.env.JWT_SECRET_KEY){
                    let payload : any = {
                        user : {
                            id: user._id,
                            userName: user.userName
                        }
                    }
                    let accessToken =jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
                    if(user._id){
                        payload = {
                            id : {
                                id: user._id,
                            }
                        }
                        let refreshToken =jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
                        return response.status(200).json({
                            message: "Logged in successfully",
                            accessToken: accessToken,
                            refreshToken: refreshToken
                        })
                    }
                } else{
                    return response.status(401).json({
                        errors: [
                            {
                                message : "Please define a valid JWT SECRET KEY"
                            }
                        ]
                    })
                }
            } else {
                return response.status(401).json({
                    errors: [
                        {
                            message: "Incorrect password"
                        }
                    ]
                })
            }
        } else {
            return response.status(401).json({
                errors: [
                    {
                        message: "Incorrect email"
                    }
                ]
            })
        }
    } else {
        return response.status(400).json({
            errors: errors.array()
        });
    }
});

export default usersRoutes;