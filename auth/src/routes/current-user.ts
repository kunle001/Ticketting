import express from 'express';
import jwt from 'jsonwebtoken';
import { currentUser } from '../midllewares/current-user';
import { requireAuth } from "../midllewares/require-auth";


const router = express.Router()

router.get('/api/user/currentUser', currentUser, requireAuth, (req, res) => {
  res.send(req.currentUser)

});

export { router as currentUserRouter }