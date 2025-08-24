const express = require('express');
const Stripe = require('stripe');
require('dotenv').config();
const app = express();
app.use(express.json());
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
app.get('/', (_req, res) => res.send('Server running'));
app.post('/test-cards', async (req, res) => {
  const cards = req.body.cards;
  const results = [];
  for (const card of cards) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 100,
        currency: 'inr',
        payment_method_data: {
          type: 'card',
          card: {
            number: card.number,
            exp_month: card.exp_month,
            exp_year: card.exp_year,
            cvc: card.cvc
          }
        },
        confirm: true
      });
      results.push({card: card.number, status: 'Success', id: paymentIntent.id});
    } catch (err) {
      results.push({card: card.number, status: 'Failed', error: err.message});
    }
  }
  res.json(results);
});
app.listen(4242, () => console.log('Server running on http://localhost:4242'));