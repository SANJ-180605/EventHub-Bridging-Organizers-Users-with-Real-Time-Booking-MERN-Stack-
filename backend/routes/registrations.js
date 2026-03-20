const express = require('express');
const router = express.Router(); // ← THIS LINE WAS MISSING!
const Event = require('../models/event');
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');

// Register for an event
router.post('/register', auth, async (req, res) => {
    try {
        const { eventId, seats, transactionId } = req.body;
        const userId = req.user.id;

        console.log('🎫 Registration attempt:', { eventId, seats, userId, transactionId });

        // Validate input
        if (!eventId || !seats) {
            return res.status(400).json({
                error: 'Event ID and seats are required'
            });
        }

        if (seats < 1) {
            return res.status(400).json({
                error: 'Must register at least 1 seat'
            });
        }

        // Find event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                error: 'Event not found'
            });
        }

        // Check seat availability
        const availableSeats = event.totalSeats - event.bookedSeats;
        if (availableSeats < seats) {
            return res.status(400).json({
                error: `Only ${availableSeats} seats available`
            });
        }

        // Check if already registered
        const existingRegistration = await Registration.findOne({
            event: eventId,
            user: userId
        });

        if (existingRegistration) {
            return res.status(400).json({
                error: 'You have already registered for this event'
            });
        }

        // Calculate total amount
        const totalAmount = event.price * seats;

        // Create registration with correct field names
        const registration = new Registration({
            event: eventId,
            user: userId,
            seatsBooked: seats,
            totalPrice: totalAmount,
            transactionId: transactionId || ''
        });

        // Update event booked seats
        event.bookedSeats += seats;

        // Save both
        await registration.save();
        await event.save();

        console.log('✅ Registration successful:', registration._id);

        res.status(201).json({
            message: 'Registration successful!',
            registration: {
                id: registration._id,
                event: event.title,
                seats: registration.seatsBooked,
                totalAmount: registration.totalPrice,
                transactionId: registration.transactionId,
                status: registration.status
            }
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                error: 'You have already registered for this event'
            });
        }
        
        res.status(500).json({
            error: 'Internal server error during registration'
        });
    }
});

// Get user's registrations
router.get('/my-registrations', auth, async (req, res) => {
    try {
        const registrations = await Registration.find({
            user: req.user.id
        }).populate('event', 'title date time location category price');

        console.log('📋 Found registrations:', registrations.length);

        res.json({
            message: 'Registrations fetched successfully',
            registrations: registrations.map(reg => ({
                id: reg._id,
                event: reg.event,
                seatsBooked: reg.seatsBooked,
                totalPrice: reg.totalPrice,
                transactionId: reg.transactionId,
                status: reg.status,
                createdAt: reg.createdAt
            }))
        });

    } catch (error) {
        console.error('❌ Error fetching registrations:', error);
        res.status(500).json({
            error: 'Failed to fetch registrations'
        });
    }
});

module.exports = router;