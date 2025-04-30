// Full History.js — Synced with current App.js and Firebase delete support

import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function History({ history, setHistory, handleDeleteDay, setView, darkMode }) {
  const theme = {
    background: darkMode ? '#0f172a' : '#f8fafc',
    card: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#e2e8f0' : '#1e293b',
    danger: '#dc2626',
    border: darkMode ? '#334155' : '#cbd5e1'
  };

  const deleteDay = async (date) => {
    const confirm = window.confirm(`Are you sure you want to delete the record for ${date}?`);
    if (!confirm) return;
    const updated = history.filter(day => day.date !== date);
    setHistory(updated);
    localStorage.setItem('history', JSON.stringify(updated));
    await deleteDoc(doc(db, 'history', date));
  };

  const tipData = history.map(day => ({
    date: day.date,
    tips: day.entries.reduce((sum, e) => sum + e.tip, 0)
  }));

  return (
    <div style={{ backgroundColor: theme.background, color: theme.text, minHeight: '100vh', padding: 20, fontFamily: 'Helvetica Neue, sans-serif' }}>
      <button
        onClick={() => setView('main')}
        style={{
          backgroundColor: 'transparent',
          color: theme.text,
          border: 'none',
          fontSize: 18,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          marginBottom: 20
        }}
      >
        ← Back
      </button>

      <h2 style={{ marginBottom: 20 }}>History</h2>

      {history.length === 0 ? (
        <p>No closed out days yet.</p>
      ) : (
        history.map((day, i) => {
          const serviceTotal = day.entries.reduce((sum, e) => sum + e.price * 0.6, 0);
          const tipTotal = day.entries.reduce((sum, e) => sum + e.tip, 0);
          const grandTotal = serviceTotal + tipTotal;

          return (
            <div key={i} style={{ backgroundColor: theme.card, padding: 20, borderRadius: 12, marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
              <h3>{day.date}</h3>
              {day.note && <p><em>Note: {day.note}</em></p>}
              <ul style={{ paddingLeft: 20 }}>
                {day.entries.map((entry, j) => (
                  <li key={j}>{entry.time} - {entry.service} - ${entry.price} + ${entry.tip}</li>
                ))}
              </ul>
              <p><strong>Service (60%):</strong> ${serviceTotal.toFixed(2)}</p>
              <p><strong>Tips:</strong> ${tipTotal.toFixed(2)}</p>
              <p><strong>Total:</strong> ${grandTotal.toFixed(2)}</p>
              <button onClick={() => deleteDay(day.date)} style={{ marginTop: 10, backgroundColor: theme.danger, color: '#fff', padding: 10, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Delete Day</button>
            </div>
          );
        })
      )}

      {tipData.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3>Tips Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tipData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke={theme.text} />
              <YAxis stroke={theme.text} />
              <Tooltip />
              <Bar dataKey="tips" fill="#22d3ee" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default History;
