import express, {Router } from 'express';
import { createTodoItem, deleteTodoItem, todoItem, todoList, updateTodoItem } from '../contoller/todo-controller';
import { body} from 'express-validator';
import { Auth } from '../middleware/auth';

const toDorouter: Router = express.Router();

toDorouter.use(Auth);

toDorouter.get('/list/:todoStatus', todoList);

toDorouter.get('/randomtodo',todoItem);

toDorouter.post('/addtodo',[
    body('description').notEmpty().withMessage('description should not be empty')
],createTodoItem);

toDorouter.patch('/:todoId',[
    body('description').optional().notEmpty().withMessage('description should not be empty')
],updateTodoItem);

toDorouter.delete('/removetodo/:todoId',deleteTodoItem);

export default toDorouter;
