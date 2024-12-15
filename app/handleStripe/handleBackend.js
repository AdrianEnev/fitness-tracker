const express = require('express');
const stripe = require('stripe')('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');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency, customerId } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            customer: customerId,
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/create-ephemeral-key', async (req, res) => {
    try {
        const { customerId } = req.body;

        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customerId },
            { apiVersion: '2020-08-27' }
        );

        res.send(ephemeralKey);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/create-or-retrieve-customer', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the customer already exists
        const customers = await stripe.customers.list({ email });
        let customer;

        if (customers.data.length > 0) {
            customer = customers.data[0];
        } else {
            // Create a new customer if one doesn't exist
            customer = await stripe.customers.create({ email });
        }

        res.send({ customerId: customer.id });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});