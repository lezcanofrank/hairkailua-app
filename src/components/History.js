// History.js with delete day functionality and confirmation prompt

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function History({ history, setView, darkMode }) {
  const [localHistory, setLocalHistory] = useState(history);

  const getTotal = (entries) => {
    const service = entries.reduce((sum, e) => sum + e.price * 0.6, 0);
    const tips = entries.reduce((sum, e) => sum + e.tip, 0);
    return { service, tips, total: service + tips };
  };

  const handleDeleteDay = (index) => {
    if (!window.confirm('Are you sure you want to delete this day?')) return;
    const updated = [...localHistory];
    updated.splice(index, 1);
    setLocalHistory(updated);
    localStorage.setItem('history', JSON.stringify(updated));
  };

  const chartData = localHistory.map(day => ({
    name: day.date,
    tips: getTotal(day.entries).tips
  }));

  const theme = {
    background: darkMode ? '#0f172a' : '#f8fafc',
    card: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#e2e8f0' : '#1e293b',
    accent: '#22d3ee'
  };

  return (
    <div style={{ backgroundColor: theme.background, color: theme.text, minHeight: '100vh', padding: 20, fontFamily: 'Helvetica Neue, sans-serif' }}>
      <h2 style={{ fontSize: 24, marginBottom: 10 }}>📅 History</h2>
      <button onClick={() => setView('main')} style={{ marginBottom: 20, backgroundColor: '#4f46e5', color: '#fff', padding: 10, border: 'none', borderRadius: 8, cursor: 'pointer' }}>← Back</button>

      {localHistory.map((day, i) => {
        const total = getTotal(day.entries);
        return (
          <div key={i} style={{ backgroundColor: theme.card, borderRadius: 12, padding: 16, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <strong>{day.date}</strong>
            {day.note && <p style={{ fontStyle: 'italic' }}>Note: {day.note}</p>}
            <p>Services (60%): ${total.service.toFixed(2)}</p>
            <p>Tips: ${total.tips.toFixed(2)}</p>
            <p><strong>Total: ${total.total.toFixed(2)}</strong></p>
            <button onClick={() => handleDeleteDay(i)} style={{ marginTop: 10, backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>🗑️ Delete Day</button>
          </div>
        );
      })}

      {localHistory.length > 0 && (
        <div style={{ backgroundColor: theme.card, borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: 10 }}>Tip Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke={theme.text} />
              <YAxis stroke={theme.text} />
              <Tooltip />
              <Bar dataKey="tips" fill={theme.accent} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default History;
