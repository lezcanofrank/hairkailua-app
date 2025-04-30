// Styled Settings.js with modern layout and consistent theme

import React, { useState } from 'react';

function Settings({ setView, tipOptions, setTipOptions, serviceList, setServiceList, darkMode, setDarkMode }) {
  const [newTip, setNewTip] = useState('');
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedPrice, setEditedPrice] = useState('');

  const theme = {
    background: darkMode ? '#0f172a' : '#f8fafc',
    card: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#e2e8f0' : '#1e293b',
    primary: '#4f46e5',
    accent: '#22d3ee',
    border: '#cbd5e1'
  };

  const addTip = () => {
    const val = parseFloat(newTip);
    if (!isNaN(val) && !tipOptions.includes(val)) {
      setTipOptions([...tipOptions, val].sort((a, b) => a - b));
      setNewTip('');
    }
  };

  const removeTip = (tip) => setTipOptions(tipOptions.filter(t => t !== tip));

  const addService = () => {
    if (newServiceName && !isNaN(parseFloat(newServicePrice))) {
      setServiceList({ ...serviceList, [newServiceName]: parseFloat(newServicePrice) });
      setNewServiceName('');
      setNewServicePrice('');
    }
  };

  const deleteService = (name) => {
    const updated = { ...serviceList };
    delete updated[name];
    setServiceList(updated);
  };

  const startEdit = (name, price) => {
    setEditingService(name);
    setEditedName(name);
    setEditedPrice(price);
  };

  const applyEdit = () => {
    if (!editedName || isNaN(parseFloat(editedPrice))) return;
    const updated = { ...serviceList };
    delete updated[editingService];
    updated[editedName] = parseFloat(editedPrice);
    setServiceList(updated);
    setEditingService(null);
    setEditedName('');
    setEditedPrice('');
  };

  return (
    <div style={{ backgroundColor: theme.background, color: theme.text, minHeight: '100vh', padding: 20, fontFamily: 'Helvetica Neue, sans-serif' }}>
      <h2 style={{ fontSize: 24, marginBottom: 10 }}>⚙️ Settings</h2>
      <button onClick={() => setView('main')} style={{ marginBottom: 20, backgroundColor: theme.primary, color: '#fff', padding: 10, border: 'none', borderRadius: 8, cursor: 'pointer' }}>← Back</button>

      <div style={{ backgroundColor: theme.card, borderRadius: 12, padding: 20, marginBottom: 30, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3>Tip Options</h3>
        {tipOptions.map(t => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
            <span style={{ marginRight: 10 }}>${t}</span>
            <button onClick={() => removeTip(t)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 6, cursor: 'pointer' }}>Remove</button>
          </div>
        ))}
        <input
          type="number"
          value={newTip}
          onChange={e => setNewTip(e.target.value)}
          placeholder="New tip"
          style={{ padding: 8, borderRadius: 8, marginRight: 10, border: `1px solid ${theme.border}` }}
        />
        <button onClick={addTip} style={{ backgroundColor: theme.accent, border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer' }}>Add Tip</button>
      </div>

      <div style={{ backgroundColor: theme.card, borderRadius: 12, padding: 20, marginBottom: 30, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3>Services</h3>
        {Object.entries(serviceList).map(([name, price]) => (
          <div key={name} style={{ marginBottom: 8 }}>
            {editingService === name ? (
              <>
                <input value={editedName} onChange={e => setEditedName(e.target.value)} style={{ marginRight: 8 }} />
                <input type="number" value={editedPrice} onChange={e => setEditedPrice(e.target.value)} style={{ marginRight: 8 }} />
                <button onClick={applyEdit}>Save</button>
              </>
            ) : (
              <>
                {name} - ${price.toFixed(2)}
                <button onClick={() => startEdit(name, price)} style={{ marginLeft: 10 }}>Edit</button>
                <button onClick={() => deleteService(name)} style={{ marginLeft: 5, color: 'crimson' }}>Delete</button>
              </>
            )}
          </div>
        ))}
        <input
          value={newServiceName}
          onChange={e => setNewServiceName(e.target.value)}
          placeholder="Service name"
          style={{ marginRight: 8, padding: 6, borderRadius: 8, border: `1px solid ${theme.border}` }}
        />
        <input
          type="number"
          value={newServicePrice}
          onChange={e => setNewServicePrice(e.target.value)}
          placeholder="Price"
          style={{ marginRight: 8, padding: 6, borderRadius: 8, border: `1px solid ${theme.border}` }}
        />
        <button onClick={addService} style={{ backgroundColor: theme.accent, border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer' }}>Add Service</button>
      </div>

      <div style={{ backgroundColor: theme.card, borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3>Appearance</h3>
        <label>
          <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} /> Enable Dark Mode
        </label>
      </div>
    </div>
  );
}

export default Settings;
