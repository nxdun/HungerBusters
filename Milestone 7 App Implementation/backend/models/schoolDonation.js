// models/SchoolDonation.js
const mongoose = require('mongoose');

// Define the schema for school donation request
const SchoolDonationSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  principalName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  document: {
    type: String, // This will store the file path or URL
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('SchoolDonation', SchoolDonationSchema);
