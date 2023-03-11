const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Web3 = require('web3');

// Dummy wallet addresses for testing
const dummyAddresses = [
  '0x3c51C5bBa1111aA67Bd04D3fB7C282B49Cc32c7f',
  '0x487E1fc2c2222B59e288E46D787bEd2bcbF797a9',
  '0x1a3427d694444a32Dc8FfD49E2dF2BBADe0e98c8',
  '0x6d7fCc75033333fCa8e54C3B3e7B63538Dc2449C',
  '0x556718857c98343XVG45Ce5KSV39916GeV4e'
];

// API endpoint for login with wallet address
router.post('/', (req, res) => {
  const {address}  = req.body;
    
  // Validate that address is a valid address
//   if (!Web3.utils.isAddress(address)) {
//     return res.status(400).json({ message: 'Invalid wallet address' });
//   }

  // Check if address is in the list of dummy addresses
  if (!dummyAddresses.includes(address)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Generate JWT token and send back as response
  const token = jwt.sign({ address }, 'secret_key');
  
  res.json({ token });
});

module.exports = router;
