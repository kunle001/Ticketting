import express from 'express';
import { currentUser } from '@kunleticket/common';
import { requireAuth } from "@kunleticket/common";


const router = express.Router()

router.get('/api/users/currentUser', currentUser, requireAuth, (req, res) => {
  res.send(req.currentUser)

});

export { router as currentUserRouter }