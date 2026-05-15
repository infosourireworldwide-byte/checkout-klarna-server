const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;
const PROCESSING_CHANNEL_ID = process.env.PROCESSING_CHANNEL_ID;

app.post('/create-payment-session', async (req, res) => {
  const { amount, currency, customerName, customerEmail, items, billingCountry } = req.body;

  try {
    const response = await fetch('https://api.sandbox.checkout.com/payment-sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency,
        reference: 'ORD-' + Date.now(), processing_channel_id: PROCESSING_CHANNEL_ID,
        billing: { address: { country: billingCountry || 'DE' } },
        customer: { name: customerName, email: customerEmail },
        items,
        success_url: 'https://sourire-worldwide.com/pages/payment-success',
        failure_url: 'https://sourire-worldwide.com/pages/payment-failure'
      })
    });

    const data = await response.json();
    res.json(data);
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
