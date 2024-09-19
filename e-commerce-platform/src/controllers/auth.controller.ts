import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {validationResult } from 'express-validator';

// Register a new user
const register = async (req: Request, res: Response): Promise<Response> => {

  // Check for validation errors
  const errors = validationResult(req);

  // If validation errors are found, return them
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(password, 10);

    // For security, restrict role to 'user' by default unless explicitly allowed
    const userRole = role && role === "admin" ? "admin" : "user";

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole, // Set role
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    return res.status(201).json({ token });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
        id: user._id,
        role: user.role,
      };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export { register, login };
