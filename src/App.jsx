import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Success from './pages/Success';
import OrganizerDashboard from './pages/organizerDashboard';
import EventsPage from './pages/EventPage';
import MyRegistrations from './pages/my-registrations';
import RegistrationPage from './pages/RegistrationPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/success" element={<Success />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />
          <Route path="/register/:eventId" element={<RegistrationPage />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Welcome from './pages/Welcome';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Success from './pages/Success';
// import OrganizerDashboard from './pages/organizerDashboard';
// import EventsPage from './pages/EventPage';
// import MyRegistrations from './pages/MyRegistrations';
// // import TokenTest from './pages/TokenTest';
// import EventsList from './components/EventsList';
// <Route path="/my-registrations" element={<MyRegistrations />} />
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<Welcome />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/success" element={<Success />} />
//           {/* We'll add these later */}
//          <Route path="/events" element={<EventsPage />} /> 
//           <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
//           <Route path="/my-registrations" element={<MyRegistrations />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;