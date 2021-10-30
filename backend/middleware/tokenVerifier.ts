import express from 'express';
import jwt from 'jsonwebtoken';
import { users } from '../database/models/users';
import userModel from '../database/schemas/usersSchema';

let tokenVerifier = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
        let accessToken = request.headers['x-auth-token'];
        let refreshToken = request.headers['refresh-token'];
        if (accessToken) {
            let key: string | undefined = process.env.JWT_SECRET_KEY;
            if (key) {
                if (typeof accessToken === "string") {
                    jwt.verify(accessToken, key, (error , decode) =>{
                        if(error){
                            if(typeof refreshToken === "string" && key && error.name === "TokenExpiredError"){
                                jwt.verify(refreshToken, key, async (error, decode) => {
                                    if(error){
                                        response.status(401).json({
                                            errors: [
                                                {
                                                    error: "Access Denied",
                                                    message: "Unauthorized user"
                                                }
                                            ]
                                        })
                                    } else {
                                        if(decode){
                                            let user: users | null = await userModel.findById(decode.id.id);
                                            if(user && key){
                                                let payload : any = {
                                                    user : {
                                                        id: user._id,
                                                        userName: user.userName
                                                    }
                                                }
                                                const accessToken = jwt.sign(payload, key, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY})
                                                return response.status(201).json({
                                                    accessToken: accessToken,
                                                    refreshToken: refreshToken
                                                })
                                            }
                                        }
                                    }
                                })
                            } else {
                                return response.status(401).json({
                                    errors: [
                                        {
                                            error: "Access Denied",
                                            message: "Invaid token"
                                        }
                                    ]
                                });
                            }
                        } else {
                            if(decode){
                                request.headers['user'] = decode.user;
                                next();
                            }
                        }
                    });
                } else {
                    return response.status(401).json({
                        errors: [
                            {
                                error: "Access Denied",
                                message: "Invaid token"
                            }
                        ]
                    });
                }
            } else {
                return response.status(401).json({
                    errors: [
                        {
                            message: "JWT SECRET KEY not found"
                        }
                    ]
                });
            }
        } else {
            return response.status(401).json({
                errors: [
                    {
                        error: "Access Denied",
                        message: "Token not found"
                    }
                ]
            });
        }
    } catch (error) {
        console.error(error);
    }
};

export default tokenVerifier;