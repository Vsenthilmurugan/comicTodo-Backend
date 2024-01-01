import express, {Router } from 'express';
import { SignUp, login } from '../contoller/login-controller';
import { body} from 'express-validator';

const loginrouter: Router = express.Router();
loginrouter.post('/login',[
    body('email').notEmpty().isEmail().withMessage('email should not be empty'),
    body('password').notEmpty().withMessage('password should not be empty'),
],login);
loginrouter.post('/signup',[
    body('name').notEmpty().withMessage('name should not be empty'),
    body('email').notEmpty().isEmail().withMessage('email should not be empty'),
    body('password').notEmpty().withMessage('password should not be empty'),
],SignUp);

export default loginrouter;