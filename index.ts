import express, { Request, Response,NextFunction, Router } from 'express';
import toDorouter from './routes/todoList';
import HttpError from './models/http-error';
import userrouter from './routes/user';
import loginrouter from './routes/login';
import { connectToDatabase } from './db/mongodb';
import cors from 'cors';

const app = express();
app.use(cors());
const port = 'https://comic-todo-backend.vercel.app';

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

app.use(express.json({ limit: '3mb' }));

app.use('/api/todo',toDorouter);
app.use('/api/user',userrouter);
app.use('/api/auth',loginrouter);

app.use((req:Request,res:Response,next:NextFunction)=>{
  throw(new HttpError('could not find this route',404));
});

app.use((error:any,req:Request,res:Response,next:NextFunction)=>{
  if(res.headersSent){
    return next(error);
  }
  res.status(error.code || 500);
  res.json({message:error.message || 'An unknown error occured !'})
})
connectToDatabase().then(()=>{
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})
