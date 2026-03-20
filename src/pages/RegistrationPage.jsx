import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../utils/api';

const RegistrationPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [formData, setFormData] = useState({
        seats: 1,
        transactionId: ''
    });

    useEffect(() => {
        fetchEventDetails();
    }, [eventId]);

    const fetchEventDetails = async () => {
  try {
    console.log('📋 Fetching event details for:', eventId);
    
    // Use the specific event endpoint instead of filtering all events
    const response = await API.get(`/events/${eventId}`);
    
    if (response.data.event) {
      setEvent(response.data.event);
      console.log('✅ Event details loaded:', response.data.event);
    } else {
      alert('Event not found!');
      navigate('/events');
    }
  } catch (error) {
    console.log('❌ Error fetching event:', error);
    
    // Fallback: try to get from all events
    try {
      const eventsResponse = await API.get('/events/all');
      const events = eventsResponse.data.events;
      const currentEvent = events.find(e => e._id === eventId);
      
      if (currentEvent) {
        setEvent(currentEvent);
      } else {
        alert('Event not found!');
        navigate('/events');
      }
    } catch (fallbackError) {
      alert('Failed to load event details');
      navigate('/events');
    }
  } finally {
    setLoading(false);
  }
};

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'seats' ? parseInt(value) || 1 : value
        }));
    };

    const calculateTotalAmount = () => {
        if (!event) return 0;
        return event.price * formData.seats;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!formData.transactionId.trim() && event.price > 0) {
            alert('Please enter transaction ID');
            return;
        }

        if (formData.seats > (event.totalSeats - event.bookedSeats)) {
            alert(`Only ${event.totalSeats - event.bookedSeats} seats available!`);
            return;
        }

        setRegistering(true);

        try {
            console.log('🎫 Final registration attempt:', {
                eventId,
                seats: formData.seats,
                transactionId: formData.transactionId
            });

            const response = await API.post('/registrations/register', {
                eventId: eventId,
                seats: formData.seats,
                transactionId: formData.transactionId
            });

            console.log('✅ Registration successful:', response.data);
            alert('🎉 Registration completed successfully!');
            navigate('/events'); 
            
        } catch (error) {
            console.log('❌ Registration failed:', error);
            alert(error.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setRegistering(false);
        }
    };

    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        navigate('/login');
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-700">Event not found</h2>
                    <button 
                        onClick={() => navigate('/events')}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const availableSeats = event.totalSeats - event.bookedSeats;
    const totalAmount = calculateTotalAmount();

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <button 
                        onClick={() => navigate('/events')}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md mb-4"
                    >
                        ← Back to Events
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Register for Event</h1>
                    <p className="text-gray-600 mt-2">Complete your registration with payment</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Event Details */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Event Details</h2>
                        
                        <div className="space-y-3">
                            <div>
                                <span className="font-medium text-gray-700">Event:</span>
                                <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                            </div>
                            
                            <div>
                                <span className="font-medium text-gray-700">Description:</span>
                                <p className="text-gray-600">{event.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Date:</span>
                                    <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Time:</span>
                                    <p className="text-gray-600">{event.time}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Location:</span>
                                    <p className="text-gray-600">{event.location}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Available Seats:</span>
                                    <p className={`font-semibold ${
                                        availableSeats > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {availableSeats}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t pt-3">
                                <span className="font-medium text-gray-700">Price per seat:</span>
                                <p className="text-lg font-bold text-gray-800">
                                    {event.price === 0 ? 'Free' : `$${event.price}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Registration Details</h2>
                        
                        <form onSubmit={handleRegister} className="space-y-6">
                            {/* User Info */}
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Your Information</h3>
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <p><span className="font-medium">Name:</span> {user.name}</p>
                                    <p><span className="font-medium">Email:</span> {user.email}</p>
                                </div>
                            </div>

                            {/* Seats Selection */}
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">
                                    Number of Seats *
                                </label>
                                <select
                                    name="seats"
                                    value={formData.seats}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    {[...Array(Math.min(availableSeats, 10))].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1} seat{i + 1 > 1 ? 's' : ''}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-sm text-gray-500 mt-1">
                                    Maximum {availableSeats} seats available
                                </p>
                            </div>

                            {/* Amount Display */}
                            <div className="bg-blue-50 p-4 rounded-md">
                                <h3 className="font-semibold text-blue-800 mb-2">Payment Summary</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-700">
                                        {formData.seats} seat{formData.seats > 1 ? 's' : ''} × ${event.price}
                                    </span>
                                    <span className="text-xl font-bold text-blue-800">
                                        ${totalAmount}
                                    </span>
                                </div>
                                {event.price === 0 && (
                                    <p className="text-green-600 font-medium mt-2">
                                        This is a free event - no payment required!
                                    </p>
                                )}
                            </div>

                            {/* Payment Section */}
{event.price > 0 && (
  <div>
    <h3 className="font-medium text-gray-700 mb-3">Payment Instructions</h3>
    
    {/* Organizer's QR Code */}
    <div className="bg-gray-100 p-4 rounded-md text-center mb-4">
      {event.qrCode ? (
        <div className="bg-white p-4 inline-block rounded-md border border-gray-300">
          <div className="w-48 h-48 bg-white flex items-center justify-center mb-2 mx-auto">
            <img 
              src={event.qrCode} 
              alt="Payment QR Code" 
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="text-gray-400 text-center hidden">
              <div className="text-4xl mb-2">📱</div>
              <p className="text-sm">QR Code not available</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Scan to pay using UPI/QR</p>
          <p className="text-xs text-gray-500 mt-1">Provided by organizer</p>
        </div>
      ) : (
        <div className="bg-white p-4 inline-block rounded-md border-2 border-dashed border-gray-300">
          <div className="w-48 h-48 bg-gray-200 flex items-center justify-center mb-2">
            <span className="text-gray-500">No QR Code Provided</span>
          </div>
          <p className="text-sm text-gray-600">Contact organizer for payment details</p>
        </div>
      )}
    </div>

    {/* Transaction ID */}
    <div>
      <label className="block font-medium text-gray-700 mb-2">
        Transaction ID *
      </label>
      <input
        type="text"
        name="transactionId"
        value={formData.transactionId}
        onChange={handleInputChange}
        placeholder="Enter your payment transaction ID"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <p className="text-sm text-gray-500 mt-1">
        Enter the transaction ID from your payment
      </p>
    </div>
  </div>
)}

                            {/* Submit Button */}
                            <button 
                                
                                type="submit"
                                disabled={registering || availableSeats === 0}
                                className={`w-full py-3 px-4 rounded-md font-semibold text-white transition duration-200 ${
                                    registering || availableSeats === 0
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg'
                                }`}
                            >
                                {registering ? (
                                    <span className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </span>
                                ) : availableSeats === 0 ? (
                                    'No Seats Available'
                                ) : (
                                    `Complete Registration - $${totalAmount}`
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;