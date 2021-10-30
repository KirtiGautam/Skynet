import mongoose from 'mongoose';

export interface users extends mongoose.Document{
    _id? : string;
    userName : string;
    password : string;
    createdAt? : string;
    updatedAt? : string;
}