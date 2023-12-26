import express, { Request, Response, Router } from 'express';

const toDorouter: Router = express.Router();

toDorouter.get('/', (req: Request, res: Response, next) => {
  console.log('GET Request in Places');
  res.json({ message: 'It works!' });
});

export default toDorouter;
