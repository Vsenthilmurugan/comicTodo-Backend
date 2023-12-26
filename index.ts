import express from 'express';
import toDorouter from './routes/todoList';

const app = express();
const port = 5000;

app.use(express.json());

app.use(toDorouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
