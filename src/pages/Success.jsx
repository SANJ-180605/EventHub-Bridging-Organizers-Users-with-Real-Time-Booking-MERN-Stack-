import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to EventHub!
        </h2>
        <p className="text-gray-600 mb-2">
          Hello <span className="font-semibold">{user?.name}</span>!
        </p>
        <p className="text-gray-600 mb-6">
          You are registered as a <span className="font-semibold capitalize">{user?.role}</span>
        </p>
        
        <div className="space-y-3">
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Go to Home
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/');
            }}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;