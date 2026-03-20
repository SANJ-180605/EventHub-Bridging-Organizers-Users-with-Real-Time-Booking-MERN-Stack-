const mongoose = require('mongoose');

const registeredLedgerSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  participantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participantName: {
    type: String,
    required: true
  },
  participantEmail: {
    type: String,
    required: true
  },
  seatsRegistered: {
    type: Number,
    required: true,
    min: 1
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  totalAmount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('RegisteredLedger', registeredLedgerSchema);