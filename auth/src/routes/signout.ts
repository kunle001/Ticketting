import express from 'express'

const router = express.Router()

router.get('/api/users/signout', (req, res) => {
  req.session = null;

  res.send({ message: "logged out sucessfully" })
});

export { router as signoutRouter }