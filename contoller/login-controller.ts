import { NextFunction, Request, Response } from "express";
import HttpError from "../models/http-error";
import { DataTypes } from "../types/types";
import { validationResult } from "express-validator";
import { client } from "../db/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const usersCollection = client.db("comic_todo").collection("users");

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed please check your data", 422);
  }
  const { email, password } = req.body;
  const existingUser = await usersCollection.findOne({ email });
  if (!existingUser) {
    return res.status(422).json({ message: "Invalid Credentials" });
  }
  const passwordMatches = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatches) {
    return res.status(422).json({ message: "Invalid Credentials" });
  }
  let token = jwt.sign({ userId: existingUser._id }, "secretkey", {
    expiresIn: "1d",
  });
  res.status(200).json({
    data: { uid: existingUser._id, token: token,theme:existingUser.theme,message:`welcome ${existingUser.name}`},
  });
};

export const SignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
      .status(422)
      .json({ message: "Invalid inputs passed please check your data" });
    }
    const { name, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const usersCollection = client.db("comic_todo").collection("users");
      const newUser = {
        name,
        email,
        password: hashedPassword,
        theme: "mickey",
      };
      
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(422).json({
          message: "Email already in use, please choose a different one",
        });
      }
      
      const result = await usersCollection.insertOne(newUser);
      
      if (!result.acknowledged || result.insertedId === null) {
        return res.status(500).json({ message: "User registration failed" });
      }
      let token = jwt.sign({ userId: result.insertedId }, "secretkey", {
      expiresIn: "1d",
    });
    res.status(201).json({
      data: { uid: result.insertedId, token: token,theme:'mickey',message: "User registered successfully",},
    });
  } catch (error) {
    return next(new HttpError("Internal server error", 500));
  }
};
