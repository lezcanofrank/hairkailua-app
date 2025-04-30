// Updated History.js with Firebase Integration for Viewing and Deleting Days

import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

function History({ history, setView, darkMode }) {
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
  
    const updatedHistory = history.filter(day => day.date !== date);
    localStorage.setItem('history', JSON.stringify(updatedHistory));
    await deleteDoc(doc(db, 'history', date));
  };  

  return (
    <div style={{ backgroundColor: theme.background, color: theme.text, minHeight: '100vh', padding: 20 }}>
      <h2>History</h2>
      <button onClick={() => setView('main')} style={{ backgroundColor: theme.border, padding: 10, border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: 20 }}>Back</button>

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
    </div>
  );
}

export default History;
