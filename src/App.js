import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import './assets/styles/global.css'; // Import global styles (optional)

// Import page components
import Dashboard from './pages/Dashboard';
import DeviceList from './pages/DeviceList';
import DeviceCreate from './pages/DeviceCreate';
import DeviceEdit from './pages/DeviceEdit';
import DeviceDetails from './pages/DeviceDetails';

// Import layout components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar'; // Optional

function App() {
  return (
    <Router>
      {/* Wrap the app in a Router for navigation */}
      <div className="app-container">
        {/* Persistent layout components */}
        <Navbar />
        {/* Optional Sidebar - uncomment if you want it */}
        {/* <Sidebar /> */}

        {/* Main content area with routes */}
        <main className="main-content">
          <Routes>
            {/* Define routes for each page */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/devices" element={<DeviceList />} />
            <Route path="/devices/create" element={<DeviceCreate />} />
            <Route path="/devices/edit/:id" element={<DeviceEdit />} />
            <Route path="/devices/:id" element={<DeviceDetails />} />
            {/* Add more routes here as needed, e.g., /rooms */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;