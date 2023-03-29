import express from 'express'

const router = express.Router()

router.get('api/user/currentUser', (req, res) => {
  res.send('welcome to current user')
});

export { router as currentUserRouter }