import { NextFunction, Request, Response } from "express";
import HttpError from "../models/http-error";
import { DataTypes } from "../types/types";
import { validationResult } from "express-validator";
import { client } from "../db/mongodb";
import { ObjectId } from "mongodb";

const usersCollection = client.db('comic_todo').collection('users');

export const userDetails =  async (req: Request, res: Response, next:NextFunction) => {
    const uid = req.params.uid;
    const objectId = new ObjectId(uid);
    const userDetail = await usersCollection.findOne({ _id:objectId})
    if(!userDetail){
      return next(new HttpError('could not find user for the given id',422));
    }
    res.json({data:userDetail});
}
export const updateUser = async (req: Request, res: Response, next:NextFunction) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const errorMessages = errors.array().map((error) => error.msg);
    const errorMessage = errorMessages.join(', ');
    throw new HttpError(errorMessage,422);
  }
  const {name,email,password,theme} = req.body;
  const uid = req.params.uid;
  const objectId = new ObjectId(uid);
  const userDetail = await usersCollection.findOne({ _id:objectId})
  if(!userDetail){
    return next(new HttpError('could not find user for the given id',404));
  }
  let userData = {...userDetail};
  if(name){
    userData.name = name;
  }if(email){
    userData.email = email;
  }if(password){
    userData.password = password;
  } if(theme){
    userData.theme = theme;
  }
  const result = await usersCollection.updateOne({ _id:objectId}, { $set: userData })
  if (result.modifiedCount === 0) {
    return null;
  }
  res.status(201).json({ message: 'User Details updated successfully', userData });
}