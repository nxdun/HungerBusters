// Assuming you have the required imports at the top
const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51Q7x6lG4mkmOcCt5ma6CmkqhAS2FZzA5sZJHWF3HBWOdVMl3mMG4Z4VdHFPzIwQUH4Mdg15v84exR286eXjvgOds00mVxm4VEg');

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


module.exports = router;
