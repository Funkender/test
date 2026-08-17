'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [brain, setBrain] = useState([]);
  const [input, setInput] = useState('');
  const [log, setLog] = useState([{ sender: 'Hans', text: 'Moin! Mein echtes Cloud-Backend ist online. Was gibt\'s?' }]);
  const [status, setStatus] = useState('Lade Gehirn...');

  useEffect(() => {
    // Hier fragt dein Handy nicht mehr Supabase direkt, sondern dein EIGENES Backend!
    fetch('/api/hans')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBrain(data);
          setStatus(`Verbunden (${data.length} Erinnerungen geladen)`);
        } else {
          setStatus('Fehler: Konnte Daten nicht lesen');
        }
      })
      .catch(() => setStatus('Verbindungsfehler zum Backend'));
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userText = input.toLowerCase();
    const newLog = [...log, { sender: 'Du', text: input }];
    setInput('');

    let answer = "Puh, das weiß ich noch nicht aus der Cloud.";
    
    // Einfache Suche in den Cloud-Daten
    const found = brain.find(b => userText.includes((b.keywords || '').toLowerCase()));
    if (found) {
      answer = found.answers;
    }

    setLog([...newLog, { sender: 'Hans', text: answer }]);
  };

  return (
    <main style={{ background: '#121212', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#1e1e1e', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
        <h2 style={{ marginTop: 0 }}>🧔‍♂️ Hans Dampf</h2>
        <div style={{ fontSize: '0.8rem', color: '#2ed573', marginBottom: '15px' }}>{status}</div>
        
        <div style={{ height: '300px', background: '#121212', padding: '15px', borderRadius: '8px', overflowY: 'auto', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {log.map((item, index) => (
            <div key={index} style={{ textAlign: item.sender === 'Du' ? 'right' : 'left' }}>
              <span style={{ display: 'inline-block', padding: '8px 12px', borderRadius: '8px', background: item.sender === 'Du' ? '#007aff' : '#333', color: '#fff', maxWidth: '85%' }}>
                <b style={{ fontSize: '0.8rem', opacity: 0.8, display: 'block', marginBottom: '3px' }}>{item.sender}</b>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Schreibe eine Nachricht..." 
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#2a2a2a', color: '#fff', fontSize: '1rem' }}
          />
          <button onClick={sendMessage} style={{ padding: '0 20px', background: '#ff6b6b', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>Senden</button>
        </div>
      </div>
    </main>

  );
}
