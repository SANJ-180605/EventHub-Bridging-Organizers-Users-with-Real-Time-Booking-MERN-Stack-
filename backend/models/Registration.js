const mongoose = require('mongoose'); // ← THIS LINE WAS MISSING!

// Check if model already exists
if (mongoose.models.Registration) {
    module.exports = mongoose.models.Registration;
} else {
    const registrationSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true
        },
        seatsBooked: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        totalPrice: {
            type: Number,
            required: true
        },
        transactionId: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            enum: ['confirmed', 'cancelled'],
            default: 'confirmed'
        }
    }, {
        timestamps: true
    });

    // Prevent duplicate registrations
    registrationSchema.index({ user: 1, event: 1 }, { unique: true });

    module.exports = mongoose.model('Registration', registrationSchema);
}