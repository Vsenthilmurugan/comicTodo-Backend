import { NextFunction, Request, Response } from "express";
import HttpError from "../models/http-error";
import { DataTypes } from "../types/types";
import { validationResult } from "express-validator";
import { client } from "../db/mongodb";

const usersCollection = client.db('comic_todo').collection('users');

export const login = async (req: Request, res: Response, next:NextFunction) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    throw new HttpError('Invalid inputs passed please check your data',422);
  }
  const {email,password} = req.body;
  const existingUser = await usersCollection.findOne({ email,password });
  if (!existingUser) {
    return res.status(422).json({ message: 'Invalid Credentials' });
  }
  res.status(200).json({data:existingUser});
}

  export const SignUp = async(req: Request, res: Response, next:NextFunction) =>{
    const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({ message: 'Invalid inputs passed please check your data'});
  }
  const {name,email,password} = req.body;
    try {
      const usersCollection = client.db('comic_todo').collection('users');
      const newUser = {
        name,
        email,
        password,
        theme: 'mickey',
      };

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ message: 'Email already in use, please choose a different one' });
    }
      
      const result = await usersCollection.insertOne(newUser);
      
      if (!result.acknowledged || result.insertedId === null) {
        return next(new HttpError('User registration failed', 500));
      }
      
      res.status(201).json({ message: 'User registered successfully', newUser });
    } catch (error) {
      return next(new HttpError('Internal server error', 500));
    }
}