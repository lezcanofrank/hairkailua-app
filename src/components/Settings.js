// Full Settings.js — Matches Updated App.js, fully functional

import React, { useState, useEffect } from 'react';

function Settings({ setView, tipOptions, setTipOptions, serviceList, setServiceList, darkMode, setDarkMode }) {
  const [newTip, setNewTip] = useState('');
  const [newService, setNewService] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(serviceList));
    localStorage.setItem('tipOptions', JSON.stringify(tipOptions));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [serviceList, tipOptions, darkMode]);

  const addTip = () => {
    const value = parseFloat(newTip);
    if (!isNaN(value) && !tipOptions.includes(value)) {
      setTipOptions([...tipOptions, value]);
      setNewTip('');
    }
  };

  const deleteTip = (tip) => {
    setTipOptions(tipOptions.filter(t => t !== tip));
  };

  const addService = () => {
    const price = parseFloat(newServicePrice);
    if (newService && !isNaN(price)) {
      setServiceList({ ...serviceList, [newService]: price });
      setNewService('');
      setNewServicePrice('');
    }
  };

  const deleteService = (service) => {
    const updated = { ...serviceList };
    delete updated[service];
    setServiceList(updated);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Helvetica Neue, sans-serif' }}>
      <h2 style={{ marginBottom: 20 }}>Settings</h2>
      <button onClick={() => setView('main')} style={{ backgroundColor: '#e2e8f0', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer', marginBottom: 20 }}>← Back</button>

      <div style={{ marginBottom: 30 }}>
        <h3>Preset Tip Options</h3>
        <ul>
          {tipOptions.map((tip, index) => (
            <li key={index}>
              ${tip}
              <button onClick={() => deleteTip(tip)} style={{ marginLeft: 10, backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer' }}>Delete</button>
            </li>
          ))}
        </ul>
        <input
          type="number"
          value={newTip}
          onChange={(e) => setNewTip(e.target.value)}
          placeholder="Add new tip amount"
          style={{ marginRight: 10 }}
        />
        <button onClick={addTip}>Add Tip</button>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3>Custom Services</h3>
        <ul>
          {Object.entries(serviceList).map(([name, price]) => (
            <li key={name}>
              {name} - ${price}
              <button onClick={() => deleteService(name)} style={{ marginLeft: 10, backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer' }}>Delete</button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          placeholder="Service name"
          style={{ marginRight: 10 }}
        />
        <input
          type="number"
          value={newServicePrice}
          onChange={(e) => setNewServicePrice(e.target.value)}
          placeholder="Price"
          style={{ marginRight: 10 }}
        />
        <button onClick={addService}>Add Service</button>
      </div>

      <div>
        <h3>Dark Mode</h3>
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            style={{ marginRight: 10 }}
          />
          Enable Dark Mode
        </label>
      </div>
    </div>
  );
}

export default Settings;
