const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');

require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
console.log(SECRET_KEY);

router.post('/', (req, res) => {
  const {address}  = req.body;
    
  const token = jwt.sign({ address }, SECRET_KEY, { expiresIn: '1h' });
  const expiresIn = 3600; 
  res.json({ token, expiresIn })
});

router.get('/auth', verifyToken, (req, res) => {
  res.send('You are authorized to access this protected resource.');
});

module.exports = router;
