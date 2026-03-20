import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const MyRegistrations = () => {
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyRegistrations();
    }, []);

    const fetchMyRegistrations = async () => {
        try {
            console.log('📋 Fetching my registrations...');
            const response = await API.get('/registrations/my-registrations');
            console.log('✅ My registrations response:', response.data);
            setRegistrations(response.data.registrations || []);
        } catch (error) {
            console.error('❌ Error fetching registrations:', error);
            setError('Failed to load your registrations');
        } finally {
            setLoading(false);
        }
    };

    const user = JSON.parse(localStorage.getItem('user'));

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading your registrations...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <nav className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">My Registrations</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Welcome, {user?.name}</span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => navigate('/events')}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                Browse Events
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

            {/* Registrations List */}
            <div className="container mx-auto px-4 py-8">
                {error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <div className="text-red-500 text-6xl mb-4">❌</div>
                        <h3 className="text-xl font-semibold text-red-800 mb-2">Error</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchMyRegistrations}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                        >
                            Try Again
                        </button>
                    </div>
                ) : registrations.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Registrations Yet</h3>
                        <p className="text-gray-600 mb-6">You haven't registered for any events yet.</p>
                        <button
                            onClick={() => navigate('/events')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Browse Events
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {registrations.map((registration) => (
                            <div key={registration.id || registration._id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {registration.event?.title || 'Event Title Not Available'}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        registration.status === 'confirmed' 
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {registration.status || 'confirmed'}
                                    </span>
                                </div>
                                
                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                    <div className="flex justify-between">
                                        <span>Date:</span>
                                        <span className="font-medium">
                                            {registration.event?.date ? new Date(registration.event.date).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Time:</span>
                                        <span className="font-medium">{registration.event?.time || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Location:</span>
                                        <span className="font-medium">{registration.event?.location || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Seats Registered:</span>
                                        <span className="font-medium">{registration.seatsBooked || registration.seats || 1}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Amount:</span>
                                        <span className="font-medium">
                                            {(registration.totalPrice === 0 || registration.totalAmount === 0) 
                                                ? 'Free' 
                                                : `$${registration.totalPrice || registration.totalAmount}`}
                                        </span>
                                    </div>
                                    {registration.transactionId && (
                                        <div className="flex justify-between">
                                            <span>Transaction ID:</span>
                                            <span className="font-medium text-blue-600">{registration.transactionId}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Registered on:</span>
                                        <span className="font-medium">
                                            {registration.createdAt ? new Date(registration.createdAt).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="border-t pt-4">
                                    <p className="text-xs text-gray-500">
                                        Registration ID: {registration.id || registration._id}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRegistrations;