import express from 'express'

const router = express.Router()

router.get('api/user/signout', (req, res) => {
  res.send('welcome to current user')
});

export { router as signoutRouter }