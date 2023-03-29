import express from 'express'

const router = express.Router()

router.post('api/user/signin', (req, res) => {
  res.send('welcome to current user')
});

export { router as signinRouter }