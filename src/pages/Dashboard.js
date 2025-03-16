import React from 'react';
import DeviceCard from '../components/dashboard/DeviceCard';
import Navbar from '../components/layout/Navbar';
import { useDevices } from '../hooks/useDevices';
import './Dashboard.css';

const Dashboard = () => {
  const { devices, loading } = useDevices();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Home Automation Dashboard</h1>
      <div className="device-grid">
        {devices.map((device) => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;