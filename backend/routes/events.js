const express = require('express');
const Event = require('../models/event');
const auth = require('../middleware/auth');

const router = express.Router();

// Create new event (Organizer only)
router.post('/create', auth, async (req, res) => {
  try {
    console.log('🎯 Creating event by:', req.user.id);
    
    const {
      title,
      description,
      date,
      time,
      location,
      totalSeats,
      price,
      category,
      image,
      qrCode  
    } = req.body;

    // Only organizers can create events
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ error: 'Only organizers can create events' });
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      totalSeats,
      price,
      category,
      image: image || '',
      qrCode: qrCode || '',  // NEW FIELD
      organizer: req.user.id
    });

    console.log('✅ Event created:', event.title);
    res.status(201).json({
      message: 'Event created successfully',
      event
    });

  } catch (error) {
    console.log('❌ Event creation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all events
router.get('/all', async (req, res) => {
  try {
    const today = new Date();
    
    const events = await Event.find({ 
      date: { $gte: today } // Only future events
    })
    .populate('organizer', 'name email')
    .sort({ date: 1 });

    console.log('📋 Found active events:', events.length);
    res.json({
      message: 'Active events fetched successfully',
      events: events.map(event => ({
        ...event.toObject(),
        availableSeats: event.totalSeats - event.bookedSeats,
        daysRemaining: Math.ceil((new Date(event.date) - today) / (1000 * 60 * 60 * 24)),
        eventStatus: event.bookedSeats >= event.totalSeats ? 'soldout' : 'active'
      }))
    });

  } catch (error) {
    console.log('❌ Get events error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      message: 'Event fetched successfully',
      event: {
        ...event.toObject(),
        availableSeats: event.totalSeats - event.bookedSeats,
        daysRemaining: Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24))
      }
    });

  } catch (error) {
    console.log('❌ Get event error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get events by organizer
router.get('/organizer/my-events', auth, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      message: 'Organizer events fetched successfully',
      events
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;