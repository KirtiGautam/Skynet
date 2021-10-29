import mongoose, { Mongoose } from 'mongoose';
import { users } from '../models/users';

let userSchema: mongoose.Schema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

const userModel: mongoose.Model<users> = mongoose.model('users', userSchema);

export default userModel;