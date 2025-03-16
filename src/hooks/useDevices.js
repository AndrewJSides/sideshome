import { useState, useEffect } from 'react';

export function useDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setDevices([
        { id: 1, name: 'Living Room Light', type: 'light' },
        { id: 2, name: 'Thermostat', type: 'thermostat' },
        { id: 3, name: 'Front Door', type: 'lock' },
        { id: 4, name: 'Back Door', type: 'lock' },
        { id: 5, name: 'Notes', type: 'notes' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return { devices, loading };
}