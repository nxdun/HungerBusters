// Assuming you have the required imports at the top
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 

// GET /v1/user/subscriptions
router.get('/subscriptions', async (req, res) => {
    const { email } = req.query; // Get email from query parameters

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Search for the Stripe customer using the email
        const customers = await stripe.customers.list({ email });

        if (customers.data.length === 0) {
            return res.status(404).json({ message: 'No customer found with this email' });
        }

        const customer = customers.data[0]; // Get the first customer matching the email

        // Fetch subscriptions for the customer
        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
        });

        res.json(subscriptions.data); // Send the subscriptions data
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ message: 'Error fetching subscriptions' });
    }
});

// Cancel subscription route
router.post('/unsubscribe', async (req, res) => {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
        return res.status(400).json({ message: 'Subscription ID is required' });
    }

    try {
        const deletedSubscription = await stripe.subscriptions.cancel(subscriptionId);
        res.json({ message: 'Subscription canceled', deletedSubscription });
    } catch (error) {
        console.error('Error canceling subscription:', error);
        res.status(500).json({ message: 'Error canceling subscription' });
    }
});


module.exports = router;
