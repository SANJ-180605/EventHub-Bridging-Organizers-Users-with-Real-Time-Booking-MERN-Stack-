import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const EventsPage = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            console.log('📋 Fetching events...');
            const response = await API.get('/events/all');
            setEvents(response.data.events);
            console.log('✅ Events loaded:', response.data.events.length);
        } catch (error) {
            console.log('❌ Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const user = JSON.parse(localStorage.getItem('user'));
    
    const handleRegisterClick = (event) => {
        // Check if user is logged in
        if (!user) {
            navigate('/login');
            return;
        }

        // Check if seats are available
        if (event.totalSeats - event.bookedSeats === 0) {
            alert('Sorry, this event is fully booked!');
            return;
        }

        // Navigate to registration page with event ID
        navigate(`/register/${event._id }`);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <nav className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Available Events</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Welcome, {user?.name}</span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => navigate('/my-registrations')}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                My Registrations
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    navigate('/');
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Events List */}
            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg py-12">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Available</h3>
                        <p className="text-gray-600">Check back later for new events!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => {
                            const availableSeats = event.totalSeats - event.bookedSeats;
                            const isFullyBooked = availableSeats === 0;
                            
                            return (
                                <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center">
                                                <span className="font-medium w-20">Date:</span>
                                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-20">Time:</span>
                                                <span>{event.time}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-20">Location:</span>
                                                <span className="flex-1">{event.location}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-20">Seats:</span>
                                                <span>
                                                    {event.bookedSeats} / {event.totalSeats} booked
                                                    <span className={`ml-2 font-medium ${
                                                        availableSeats > 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        ({availableSeats} available)
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-40">Price:</span>
                                                <span className={event.price === 0 ? 'text-green-600 font-medium' : ''}>
                                                    {event.price === 0 ? 'Free' : `$${event.price}`}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-20">Category:</span>
                                                <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                                    {event.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-between items-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                !isFullyBooked 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {!isFullyBooked ? 'Available' : 'Sold Out'}
                                            </span>

                                            <button
                                                onClick={() => handleRegisterClick(event)}
                                                disabled={isFullyBooked}
                                                className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                                                    !isFullyBooked
                                                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                            >
                                                {!isFullyBooked ? 'Register Now' : 'Sold Out'}
                                            </button>
                                        </div>

                                        {/* Quick seat availability warning */}
                                        {availableSeats > 0 && availableSeats <= 5 && (
                                            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-md p-2">
                                                <p className="text-yellow-800 text-xs text-center">
                                                    ⚠️ Only {availableSeats} seat{availableSeats > 1 ? 's' : ''} left!
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Floating Action Button for Mobile */}
            <button
                onClick={() => navigate('/my-registrations')}
                className="fixed bottom-6 right-6 md:hidden bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            </button>
        </div>
    );
};

export default EventsPage;