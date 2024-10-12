const mongoose = require('mongoose');

const ElderDonationSchema = new mongoose.Schema({
  elderHomeName: {
    type: String,
    required: true
  },
  eldersCount: {
    type: Number,
    required: true
  },
  elderHomeAddress: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  specialRequests: {
    type: String,
    default: ''
  },
  donationTypes: {
    type: [String],
    required: true
  },
  approved: {
    type: Boolean,
    default: false // Default value is false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ElderDonation', ElderDonationSchema);