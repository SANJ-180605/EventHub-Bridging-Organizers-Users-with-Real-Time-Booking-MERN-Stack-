import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    totalSeats: '',
    price: '',
    category: 'conference',
    image: '',
    qrCode: '' // New field for QR code
  });

  const handleEventChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      console.log('📝 Creating event:', eventForm);
      
      const response = await API.post('/events/create', {
        ...eventForm,
        totalSeats: parseInt(eventForm.totalSeats),
        price: parseFloat(eventForm.price) || 0
      });

      alert('Event created successfully!');
      setShowForm(false); // Changed from true to false to close form after creation
      setEventForm({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        totalSeats: '',
        price: '',
        category: 'conference',
        image: '',
        qrCode: '' // Reset QR code field
      });

    } catch (error) {
      console.log('❌ Event creation error:', error);
      alert(error.response?.data?.error || 'Failed to create event');
    }
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Organizer Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/');
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Events</h2>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              Create New Event
            </button>
          </div>
        </div>

        {/* Event Creation Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Title</label>
                  <input
                    type="text"
                    name="title"
                    value={eventForm.title}
                    onChange={handleEventChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={eventForm.category}
                    onChange={handleEventChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="meetup">Meetup</option>
                    <option value="concert">Concert</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={eventForm.description}
                  onChange={handleEventChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={eventForm.date}
                    onChange={handleEventChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={eventForm.time}
                    onChange={handleEventChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={eventForm.location}
                    onChange={handleEventChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Seats</label>
                  <input
                    type="number"
                    name="totalSeats"
                    value={eventForm.totalSeats}
                    onChange={handleEventChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={eventForm.price}
                    onChange={handleEventChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Event Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Image URL (Optional)</label>
                <input
                  type="url"
                  name="image"
                  value={eventForm.image}
                  onChange={handleEventChange}
                  placeholder="https://example.com/event-image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">Link to an image that represents your event</p>
              </div>

              {/* QR Code Image URL - NEW FIELD */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment QR Code URL (Optional)</label>
                <input
                  type="url"
                  name="qrCode"
                  value={eventForm.qrCode}
                  onChange={handleEventChange}
                  placeholder="https://example.com/qr-code.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to your payment QR code image. This will be shown to participants during registration.
                </p>
                
                {/* QR Code Preview */}
                {eventForm.qrCode && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">QR Code Preview:</p>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 h-32 bg-white border border-gray-300 rounded-md flex items-center justify-center">
                        <img 
                          src={eventForm.qrCode} 
                          alt="QR Code Preview" 
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="text-gray-400 text-xs text-center hidden">
                          QR Code Preview
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600">
                          Participants will scan this QR code to make payments for your event.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
                >
                  Create Event
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events List (will populate later) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">My Created Events</h3>
          <p className="text-gray-500">No events created yet. Create your first event!</p>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;