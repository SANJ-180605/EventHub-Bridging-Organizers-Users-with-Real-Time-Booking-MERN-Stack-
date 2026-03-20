import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const [organizeHover, setOrganizeHover] = useState(false);
  const [registerHover, setRegisterHover] = useState(false);

  const handleOrganizeClick = () => {
    navigate('/login', { state: { userType: 'organizer' } });
  };

  const handleRegisterClick = () => {
    navigate('/login', { state: { userType: 'participant' } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Navigation Bar */}
      <nav className="bg-white/10 backdrop-blur-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">EventHub</h1>
          <div className="space-x-6">
            <a href="#home" className="text-white hover:text-yellow-300 transition">Home</a>
            <a href="#contact" className="text-white hover:text-yellow-300 transition">Contact</a>
            <a href="/login" className="text-white hover:text-yellow-300 transition">Login</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Welcome to <span className="text-yellow-300">EventHub</span>
        </h1>
        <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
          Your one-stop platform for organizing and registering amazing events
        </p>

        {/* Buttons Container */}
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {/* Organize Button */}
          <div className="relative group">
            <button 
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              onMouseEnter={() => setOrganizeHover(true)}
              onMouseLeave={() => setOrganizeHover(false)}
              onClick={handleOrganizeClick}
            >
              Organize Event
            </button>
            {organizeHover && (
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white p-3 rounded-lg w-64">
                Create and manage your events, set seats, and host amazing experiences
              </div>
            )}
          </div>

          {/* Register Button */}
          <div className="relative group">
            <button 
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              onMouseEnter={() => setRegisterHover(true)}
              onMouseLeave={() => setRegisterHover(false)}
              onClick={handleRegisterClick}
            >
              Register for Events
            </button>
            {registerHover && (
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white p-3 rounded-lg w-64">
                Browse and register for exciting events in your area
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;