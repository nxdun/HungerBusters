const express = require('express');
const router = express.Router();
const multer = require('multer');
const SchoolDonation = require('../models/schoolDonation');

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique file names
  }
});

const upload = multer({ storage: storage });

// Route to handle POST request to submit school donation
router.post('/', upload.single('studentDetailsFile'), async (req, res) => {
  try {
    const { schoolName, contactNumber, principalName, address } = req.body;
    const document = req.file.path;

    if (!schoolName || !contactNumber || !principalName || !address || !document) {
      return res.status(400).json({ message: 'All fields are required, including the document.' });
    }

    const newDonation = new SchoolDonation({
      schoolName,
      contactNumber,
      principalName,
      address,
      document,
      approved: false // Set default approval status
    });

    await newDonation.save();

    res.status(201).json({ message: 'Donation request submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Route to handle GET request to fetch all school donations
router.get('/', async (req, res) => {
  try {
    const donations = await SchoolDonation.find(); // Fetch all donations
    res.status(200).json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Route to approve a school donation request
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await SchoolDonation.findByIdAndUpdate(id, { approved: true }, { new: true }); // Approve the donation

    if (!donation) {
      return res.status(404).json({ message: 'Donation request not found.' });
    }

    res.status(200).json({ message: 'Donation request approved successfully.', donation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
