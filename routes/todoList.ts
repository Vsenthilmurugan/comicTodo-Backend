import express, {Router } from 'express';
import { createTodoItem, deleteTodoItem, todoItem, todoList, updateTodoItem } from '../contoller/todo-controller';
import { body} from 'express-validator';

const toDorouter: Router = express.Router();
toDorouter.get('/list/:todoStatus', todoList);

toDorouter.get('/:todoId',todoItem);
toDorouter.post('/',[
    body('description').notEmpty().withMessage('description should not be empty')
],createTodoItem);
toDorouter.patch('/:todoId',[
    body('description').optional().notEmpty().withMessage('description should not be empty')
],updateTodoItem);
toDorouter.delete('/:todoId',deleteTodoItem);

export default toDorouter;
