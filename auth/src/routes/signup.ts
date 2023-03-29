import express from 'express'

const router = express.Router()

router.post('api/user/signup', (req, res) => {
  res.send('welcome to current user')
});

export { router as signupRouter }