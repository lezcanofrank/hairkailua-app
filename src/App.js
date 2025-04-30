// Full App.js — All Logic and Full JSX UI (No Summaries)

import React, { useState, useEffect, useRef } from 'react';
import Settings from './components/Settings';
import History from './components/History';
import Login from './components/Login';
import { FaCut, FaClipboardList } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  saveEntriesToFirestore,
  saveClosedDayToFirestore,
  loadEntriesFromFirestore,
  loadHistoryFromFirestore
} from './firebaseSync';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [entries, setEntries] = useState([]);
  const [history, setHistory] = useState([]);
  const [serviceList, setServiceList] = useState(() => JSON.parse(localStorage.getItem('services')) || {
    "Basic Military Haircut": 18,
    "Lined Up Military Haircut": 20,
    "Haircut and Eyebrows": 34,
    "Civilian Haircut": 24,
    "Kids Haircut": 22,
    "Senior Haircut": 22,
  });
  const [tipOptions, setTipOptions] = useState(() => JSON.parse(localStorage.getItem('tipOptions')) || [3, 4, 5, 10]);
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('darkMode')) || false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const [view, setView] = useState('main');
  const [service, setService] = useState('');
  const [customServicePrice, setCustomServicePrice] = useState('');
  const [selectedTip, setSelectedTip] = useState(null);
  const [customTip, setCustomTip] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [dailyNote, setDailyNote] = useState('');
  const [showEntries, setShowEntries] = useState(false);

  const summaryRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      const loadedEntries = await loadEntriesFromFirestore();
      const loadedHistory = await loadHistoryFromFirestore();
      setEntries(loadedEntries);
      setHistory(loadedHistory);
      setInitialLoadDone(true);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (initialLoadDone) {
      localStorage.setItem('entries', JSON.stringify(entries));
      saveEntriesToFirestore(entries);
    }
  }, [entries, initialLoadDone]);

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(serviceList));
    localStorage.setItem('tipOptions', JSON.stringify(tipOptions));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [serviceList, tipOptions, darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const handleDeleteDay = async (date) => {
    const confirm = window.confirm(`Are you sure you want to delete the record for ${date}?`);
    if (!confirm) return;
    const updated = history.filter(day => day.date !== date);
    setHistory(updated);
    localStorage.setItem('history', JSON.stringify(updated));
    await deleteDoc(doc(db, 'history', date));
  };

  const handleAddEntry = () => {
    const price = service === 'Custom' ? parseFloat(customServicePrice) : serviceList[service];
    const tip = selectedTip !== null ? selectedTip : parseFloat(customTip);
    if (!service || isNaN(price) || isNaN(tip)) return alert('Invalid entry.');
    const time = new Date().toLocaleTimeString();
    const newEntry = { service, price, tip, time };
    if (editingIndex !== null) {
      const updated = [...entries];
      updated[editingIndex] = newEntry;
      setEntries(updated);
      setEditingIndex(null);
    } else {
      setEntries([...entries, newEntry]);
    }
    setService('');
    setCustomServicePrice('');
    setSelectedTip(null);
    setCustomTip('');
  };

  const handleEditEntry = (index) => {
    const entry = entries[index];
    setService(serviceList[entry.service] ? entry.service : 'Custom');
    setCustomServicePrice(serviceList[entry.service] ? '' : entry.price);
    setSelectedTip(tipOptions.includes(entry.tip) ? entry.tip : null);
    setCustomTip(tipOptions.includes(entry.tip) ? '' : entry.tip);
    setEditingIndex(index);
  };

  const handleCloseDay = async () => {
    if (!window.confirm('Are you sure you want to close out the day?')) return;
    const date = new Date().toLocaleDateString();
    const closedDay = { date, note: dailyNote, entries };
    const updatedHistory = [...history, closedDay];
    setHistory(updatedHistory);
    await saveClosedDayToFirestore(date, dailyNote, entries);
    localStorage.setItem('history', JSON.stringify(updatedHistory));
    setEntries([]);
    setDailyNote('');
    setShowSummary(false);
    setShowEntries(false);
  };

  const exportPDF = () => {
    const input = summaryRef.current;
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`HairKailua_Summary_${new Date().toLocaleDateString()}.pdf`);
    });
  };

  const getTotal = (list) => {
    const serviceTotal = list.reduce((sum, e) => sum + e.price * 0.6, 0);
    const tipTotal = list.reduce((sum, e) => sum + e.tip, 0);
    return { serviceTotal, tipTotal, total: serviceTotal + tipTotal };
  };

  const total = getTotal(entries);
  const theme = {
    background: darkMode ? '#0f172a' : '#f8fafc',
    card: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#e2e8f0' : '#1e293b',
    primary: '#4f46e5',
    secondary: '#64748b',
    accent: '#22d3ee',
    highlight: '#3b82f6'
  };

  if (!isLoggedIn) return <Login setIsLoggedIn={setIsLoggedIn} />;
  if (view === 'history') return <History history={history} setHistory={setHistory} handleDeleteDay={handleDeleteDay} setView={setView} darkMode={darkMode} />;
  if (view === 'settings') return <Settings setView={setView} tipOptions={tipOptions} setTipOptions={setTipOptions} serviceList={serviceList} setServiceList={setServiceList} darkMode={darkMode} setDarkMode={setDarkMode} />;

  return (
    <div style={{ backgroundColor: theme.background, color: theme.text, minHeight: '100vh', padding: 20, fontFamily: 'Helvetica Neue, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FaCut size={28} color={theme.primary} />
            <h1 style={{ fontSize: 26, fontWeight: 'bold', margin: 0 }}>Hair Kailua Ticket Logger lol</h1>
            <FaClipboardList size={24} color={theme.primary} />
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowMenu(!showMenu)} style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', color: theme.text }}>☰</button>
          {showMenu && (
            <div style={{ position: 'absolute', top: 40, right: 0, backgroundColor: theme.card, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', padding: 10, zIndex: 10 }}>
              <button onClick={() => { setView('history'); setShowMenu(false); }} style={{ display: 'block', padding: '8px 16px', width: '100%', textAlign: 'left', background: 'none', border: 'none', color: theme.text, cursor: 'pointer' }}>History</button>
              <button onClick={() => { setView('settings'); setShowMenu(false); }} style={{ display: 'block', padding: '8px 16px', width: '100%', textAlign: 'left', background: 'none', border: 'none', color: theme.text, cursor: 'pointer' }}>Settings</button>
              <button onClick={handleLogout} style={{ display: 'block', padding: '8px 16px', width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>Logout</button>
            </div>
          )}
        </div>
      </header>

      <div style={{ marginTop: 30 }}>
        <button onClick={() => setShowSummary(!showSummary)} style={{ backgroundColor: theme.secondary, color: '#fff', padding: 10, borderRadius: 10, border: 'none', cursor: 'pointer' }}>See Today's Summary</button>
        <button onClick={() => setShowEntries(!showEntries)} style={{ marginLeft: 10, backgroundColor: theme.secondary, color: '#fff', padding: 10, borderRadius: 10, border: 'none', cursor: 'pointer' }}>View Entries</button>
      </div>

      {showSummary && (
        <div ref={summaryRef} style={{ marginTop: 20, background: theme.card, borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <textarea placeholder="Add a note for the day..." value={dailyNote} onChange={e => setDailyNote(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 10, marginBottom: 10, border: '1px solid #cbd5e1' }} />
          <p>Service (60%): ${total.serviceTotal.toFixed(2)}</p>
          <p>Tips: ${total.tipTotal.toFixed(2)}</p>
          <p><strong>Total: ${total.total.toFixed(2)}</strong></p>
          <button onClick={handleCloseDay} style={{ marginTop: 10, backgroundColor: '#dc2626', color: '#fff', padding: 12, borderRadius: 12, border: 'none', cursor: 'pointer' }}>Close Out Day</button>
          <button onClick={exportPDF} style={{ marginTop: 10, marginLeft: 10, backgroundColor: theme.accent, color: '#000', padding: 12, borderRadius: 12, border: 'none', cursor: 'pointer' }}>Export Summary to PDF</button>
        </div>
      )}

      {showEntries && entries.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3 style={{ marginBottom: 10 }}>Today's Entries</h3>
          {entries.map((e, i) => (
            <div key={i} style={{ padding: 10, backgroundColor: theme.card, borderRadius: 10, marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              #{i + 1} - {e.time} - {e.service} - ${e.price} + ${e.tip}
              <button onClick={() => handleEditEntry(i)} style={{ marginLeft: 10, background: theme.primary, color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}>Edit</button>
            </div>
          ))}
          <p style={{ marginTop: 10 }}><strong>Quick Total:</strong> ${total.total.toFixed(2)}</p>
        </div>
      )}

      <div style={{ marginTop: 40, backgroundColor: theme.card, borderRadius: 12, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <select value={service} onChange={e => setService(e.target.value)} style={{ padding: 12, width: '100%', borderRadius: 8, marginBottom: 10, border: '1px solid #cbd5e1' }}>
          <option value="">Select service</option>
          {Object.keys(serviceList).map(s => (
            <option key={s} value={s}>{s} - ${serviceList[s]}</option>
          ))}
          <option value="Custom">Custom</option>
        </select>

        {service === 'Custom' && (
          <input type="number" value={customServicePrice} onChange={e => setCustomServicePrice(e.target.value)} placeholder="Custom price" style={{ padding: 12, width: '100%', borderRadius: 8, marginBottom: 10, border: '1px solid #cbd5e1' }} />
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {tipOptions.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTip(selectedTip === t ? null : t)}
              style={{
                background: selectedTip === t ? theme.highlight : theme.accent,
                color: '#000',
                borderRadius: 20,
                padding: '6px 12px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ${t}
            </button>
          ))}
          <input type="number" value={customTip} onChange={e => setCustomTip(e.target.value)} placeholder="Custom tip" style={{ padding: 12, borderRadius: 8, border: '1px solid #cbd5e1' }} />
        </div>

        <button onClick={handleAddEntry} style={{ marginTop: 20, width: '100%', padding: 14, fontSize: 16, fontWeight: 'bold', backgroundColor: theme.primary, color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
          {editingIndex !== null ? 'Update Entry' : 'Add Entry'}
        </button>
      </div>
    </div>
  );
}

export default App;
