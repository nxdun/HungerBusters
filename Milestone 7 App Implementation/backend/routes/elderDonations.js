const express = require('express');
const router = express.Router();
const ElderDonation = require('../models/elderDonation');

// Create a new donation request
router.post('/', async (req, res) => {
  const { elderHomeName, eldersCount, elderHomeAddress, contactNumber, contactPerson, specialRequests, donationTypes } = req.body;

  try {
    const newDonation = new ElderDonation({
      elderHomeName,
      eldersCount,
      elderHomeAddress,
      contactNumber,
      contactPerson,
      specialRequests,
      donationTypes
    });

    const savedDonation = await newDonation.save();
    res.status(201).json({ message: 'Donation request created successfully!', data: savedDonation });
  } catch (error) {
    console.error('Error creating donation request:', error);
    res.status(500).json({ message: 'An error occurred while creating the donation request.' });
  }
});

// Export the router
module.exports = router;
