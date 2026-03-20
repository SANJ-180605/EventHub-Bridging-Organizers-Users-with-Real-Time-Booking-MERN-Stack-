import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Registration = ({ event, onRegistrationComplete }) => {
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [availableSeats, setAvailableSeats] = useState(event.availableSeats);

  useEffect(() => {
    checkAvailability();
  }, [event._id]);

  const checkAvailability = async () => {
    try {
      const response = await axios.get(`/api/registration/availability/${event._id}`);
      setAvailableSeats(response.data.availableSeats);
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (availableSeats === 0) {
      setMessage('No seats left for this event');
      return;
    }

    if (seats > availableSeats) {
      setMessage(`Only ${availableSeats} seats available`);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/registration/register', {
        eventId: event._id,
        seats: seats,
        participantName: 'User Name', // Get from user profile
        participantEmail: 'user@email.com' // Get from user profile
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Registration successful!');
      setAvailableSeats(response.data.remainingSeats);
      
      if (onRegistrationComplete) {
        onRegistrationComplete(response.data.registration);
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 mt-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Register for {event.title}
      </h3>
      
      <div className="mb-4 p-3 bg-white rounded-lg border">
        <p className="text-gray-700">
          <span className="font-semibold">Available Seats:</span>{' '}
          <span className={`font-bold ${availableSeats === 0 ? 'text-red-600' : 'text-green-600'}`}>
            {availableSeats}
          </span>
          {availableSeats === 0 && (
            <span className="text-red-600 ml-2 font-medium">
              No seats left!
            </span>
          )}
        </p>
      </div>

      {availableSeats > 0 && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Seats:
            </label>
            <input
              type="number"
              id="seats"
              min="1"
              max={availableSeats}
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || availableSeats === 0}
            className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors ${
              loading || availableSeats === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : (
              'Register Now'
            )}
          </button>
        </form>
      )}

      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.includes('successful') 
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message}
        </div>
      )}

      {availableSeats === 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-center">
          <h4 className="font-semibold text-yellow-800 text-lg">This event is fully booked!</h4>
          <p className="text-yellow-700 mt-1">No more seats available for registration.</p>
        </div>
      )}
    </div>
  );
};

export default Registration;