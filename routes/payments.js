const express = require('express');
const router = express.Router();


const stripe = require('stripe')('sk_test_51MvbghFgr9NTiTbNC4cizM73Hc78579KvmUtrnRthDI68ebrJXgoTiJ3XS1fMshu8yoAVqTEos5Frd3RDAoTBbtC00GglnuIyI')

router.post('/', async (req, res) => {
  try {
    const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 500, 
    currency: "usd",
    payment_method_types: ['card'],
    description: "Meal Plan Fee",
  });

  res.json(paymentIntent); 

   } catch (err) {
     console.log(err);
     res.status(500).json({ message: 'Server Error' });
   }
});

router.post('/retrieve', async (req, res) => {
  const paymentIntentId = req.body.id;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    res.json(paymentIntent);
  } catch (error) {
    // PaymentIntent could not be retrieved
    res.status(500).json({ error: 'PaymentIntent could not be retrieved' });
  }
});

module.exports = router;
