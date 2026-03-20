const mongoose = require('mongoose');

// Check if model already exists to prevent OverwriteModelError
if (mongoose.models.Event) {
  module.exports = mongoose.models.Event;
} 

else {
  const eventSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1
    },
    bookedSeats: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      required: true
    },
    organizer: {
      type: String, // Changed to String temporarily
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    qrCode: {  // NEW FIELD
      type: String,
      default: ''
    }
  }, {
    timestamps: true
  });

// Virtual for available seats
  eventSchema.virtual('availableSeats').get(function() {
    return this.totalSeats - this.bookedSeats;
  });

  // Virtual for days remaining
  eventSchema.virtual('daysRemaining').get(function() {
    const today = new Date();
    const eventDate = new Date(this.date);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  });

  // Virtual for event status
  eventSchema.virtual('eventStatus').get(function() {
    const today = new Date();
    const eventDate = new Date(this.date);
    
    if (this.status === 'cancelled') return 'cancelled';
    if (eventDate < today) return 'completed';
    if (this.bookedSeats >= this.totalSeats) return 'soldout';
    return 'active';
  });

  module.exports = mongoose.model('Event', eventSchema);
}