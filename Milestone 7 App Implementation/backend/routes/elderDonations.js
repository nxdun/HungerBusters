const express = require('express');
const router = express.Router();
const ElderDonation = require('../models/elderDonation');

// Create a new donation request
router.post('/', async (req, res) => {
  const {
    elderHomeName,
    eldersCount,
    elderHomeAddress,
    contactNumber,
    contactPerson,
    specialRequests,
    donationTypes
  } = req.body;

  try {
    const newDonation = new ElderDonation({
      elderHomeName,
      eldersCount,
      elderHomeAddress,
      contactNumber,
      contactPerson,
      specialRequests,
      donationTypes,
      approved: false // Default to false
    });

    const savedDonation = await newDonation.save();
    res.status(201).json({ message: 'Donation request created successfully!', data: savedDonation });
  } catch (error) {
    console.error('Error creating donation request:', error);
    res.status(500).json({ message: 'An error occurred while creating the donation request.' });
  }
});

// Get all donation requests
router.get('/', async (req, res) => {
  try {
    const donations = await ElderDonation.find();
    res.json(donations);
  } catch (error) {
    console.error('Error fetching donation requests:', error);
    res.status(500).json({ message: 'An error occurred while fetching donation requests.' });
  }
});

// Approve a donation request
// In your elder donation router
router.put('/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    const donation = await ElderDonation.findByIdAndUpdate(id, { approved: true }, { new: true });
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.status(200).json({ message: 'Donation approved', data: donation });
  } catch (error) {
    console.error('Error approving donation:', error);
    res.status(500).json({ message: 'An error occurred while approving the donation.' });
  }
});

// Export the router
module.exports = router;