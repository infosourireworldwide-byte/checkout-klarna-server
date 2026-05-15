const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(STRIPE_SECRET_KEY);

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency, customerName, customerEmail } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['klarna'],
      receipt_email: customerEmail,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/webhook', (req, res) => {
  const event = req.body;
  console.log('Webhook received:', event.type);
  res.status(200).send('OK');
});

app.listen(3000, () => console.log('Server running'));
