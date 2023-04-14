import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { BadRequestError, validateRequest, CustomError } from '@kunleticket/common'
import { User } from '../models/users'

const router = express.Router()

router.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be betwen 4 and 20')
], validateRequest, async (req: Request, res: Response) => {


  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('this email is in use')
  };

  const user = User.build({ email, password });
  await user.save();

  // Generate JWT

  const userjwt = jwt.sign({
    id: user.id,
    email: user.email
  }, process.env.JWT_KEY!);

  // Store it on session
  res.cookie('secretoken', userjwt, {
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  res.status(201).send(user)

});

export { router as signupRouter }