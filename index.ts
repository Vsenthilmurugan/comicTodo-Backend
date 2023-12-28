import express, { Request, Response,NextFunction, Router } from 'express';
import toDorouter from './routes/todoList';
import HttpError from './models/http-error';
import userrouter from './routes/user';
import loginrouter from './routes/login';
import { connectToDatabase } from './db/mongodb';

const app = express();
const port = 5000;

app.use(express.json());

app.use((req:Request,res:Response,next:NextFunction)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE');

});

app.use('/api/todo',toDorouter);
app.use('/api/user',userrouter);
app.use('/api/login',loginrouter);

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
