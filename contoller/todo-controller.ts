import { NextFunction, Request, Response } from "express";
import HttpError from "../models/http-error";
import { DataTypes } from "../types/types";
import { validationResult } from "express-validator";
import { client } from "../db/mongodb";
import { ObjectId } from "mongodb";

const todoCollection = client.db("comic_todo").collection("todos");

export const todoList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const todoStatus = req.params.todoStatus;
  const todoItems = await todoCollection.find({ status: todoStatus }).toArray();
  if (todoItems.length == 0) {
    return res.status(200).json({ message: "No Item Found", data: todoItems });
  }
  res.json({ data: todoItems });
};
export const todoItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const todoItems = await todoCollection
    .find({ status: "available" })
    .toArray();
  if (todoItems.length == 0) {
    return res.status(422).json({ message: "No Data Found Please Add To Generate!" });
  }
  const randomIndex = Math.floor(Math.random() * todoItems.length);
  res.status(200).json({ data: todoItems[randomIndex] });
};

export const createTodoItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    const errorMessage = errorMessages.join(", ");
    return res.status(422).json({ message: errorMessage });
  }
  const { description, status = "available", uid } = req.body;
  try {
    const newTodoItem = {
      description,
      status,
      uid,
    };
    const result = await todoCollection.insertOne(newTodoItem);

    if (!result.acknowledged || result.insertedId === null) {
      return next(new HttpError("Todo Item Creation failed", 500));
    }
    res.status(201).json({ message: "Todo Item Created successfully" });
  } catch (error) {
    return next(new HttpError("Internal server error", 500));
  }
};
export const updateTodoItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    const errorMessage = errorMessages.join(", ");
    return res.status(422).json({ message: errorMessage });
  }
  const { description, status } = req.body;
  const todoId = req.params.todoId;
  const objectId = new ObjectId(todoId);
  const todoItem = await todoCollection.findOne({ _id: objectId });
  let message;
  if (!todoItem) {
    return next(
      new HttpError("could not find todo Item for the given id", 404)
    );
  }
  let todoData = { ...todoItem };
  if (description) {
    todoData.description = description;
    message = "Todo Item Updated";
  }
  if (status) {
    todoData.status = status;
    message = `Todo Item status updated to ${status}`;
  }
  const result = await todoCollection.updateOne(
    { _id: objectId },
    { $set: todoData }
  );
  if (result.modifiedCount === 0) {
    return null;
  }
  res.status(200).json({ data: { message: message } });
};
export const deleteTodoItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const todoId = req.params.todoId;
  const objectId = new ObjectId(todoId);
  const todoItem = await todoCollection.findOneAndDelete({ _id: objectId });
  if (!todoItem) {
    return next(
      new HttpError("could not find todo Item for the given id", 404)
    );
  }
  res.status(200).json({ data: { message: "Successfully Deleted" } });
};
