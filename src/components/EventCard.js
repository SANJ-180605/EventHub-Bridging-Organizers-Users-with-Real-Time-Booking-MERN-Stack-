import React, { useState } from 'react';
import Registration from './Registration';

const EventCard = ({ event }) => {
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6 hover:shadow-md transition-shadow">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>
      <p className="text-gray-600 mb-4">{event.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Total Seats</p>
          <p className="font-semibold text-gray-800">{event.totalSeats}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Available Seats</p>
          <p className={`font-semibold ${
            event.availableSeats > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {event.availableSeats}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Price per Seat</p>
          <p className="font-semibold text-gray-800">${event.pricePerSeat}</p>
        </div>
      </div>

      <button 
        onClick={() => setShowRegistration(!showRegistration)}
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {showRegistration ? 'Hide Registration' : 'Register for Event'}
      </button>

      {showRegistration && (
        <Registration 
          event={event} 
          onRegistrationComplete={() => {
            setShowRegistration(false);
            // You might want to refresh events list here
          }}
        />
      )}
    </div>
  );
};

export default EventCard;