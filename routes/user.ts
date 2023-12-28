import express, {Router } from 'express';
import {updateUser, userDetails } from '../contoller/user-controller';
import { body} from 'express-validator';

const userrouter: Router = express.Router();
userrouter.get('/:uid',userDetails);

userrouter.patch('/:uid',[
    body('name').optional().notEmpty().withMessage('name should not be empty'),
    body('email').optional().notEmpty().isEmail().withMessage('email should not be empty'),
    body('password').optional().notEmpty().withMessage('password should not be empty'),
],updateUser );

export default userrouter;
