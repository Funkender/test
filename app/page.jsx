'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [brain, setBrain] = useState([]);
  const [input, setInput] = useState('');
  const [log, setLog] = useState([{ sender: 'Hans', text: 'Moin! Ich bin online. Was ich nicht weiß, kannst du mir beibringen!' }]);
  const [status, setStatus] = useState('Lade Gehirn...');
  const [learningKeyword, setLearningKeyword] = useState(null);

  // Das Initiale Laden ohne externe Funktion (verhindert den Vercel-Error)
  useEffect(() => {
    fetch('/api/hans')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBrain(data);
          setStatus(`Verbunden (${data.length} Erinnerungen geladen)`);
        }
      });
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    const newLog = [...log, { sender: 'Du', text: userText }];
    setInput('');

    // Befinden wir uns im "Lern-Modus"?
    if (learningKeyword) {
      setLog([...newLog, { sender: 'Hans', text: 'Danke! Ich speichere das in der Cloud...' }]);
      
      // Neues Wissen in die Cloud hochladen
      await fetch('/api/hans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: learningKeyword, answers: userText })
      });

      setLog([...newLog, { sender: 'Hans', text: `Verstanden! Wenn mich ab jetzt jemand nach "${learningKeyword}" fragt, weiß ich Bescheid.` }]);
      setLearningKeyword(null); 
      
      // Gehirn danach sofort aktualisieren
      fetch('/api/hans')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setBrain(data);
            setStatus(`Verbunden (${data.length} Erinnerungen geladen)`);
          }
        });
      return;
    }

    // Normaler Chat-Modus
    const lowerText = userText.toLowerCase();
    const found = brain.find(b => lowerText.includes((b.keywords || '').toLowerCase()));
    
    if (found) {
      setLog([...newLog, { sender: 'Hans', text: found.answers }]);
    } else {
      // Hans weiß es nicht -> Lernmodus aktivieren!
      setLearningKeyword(lowerText);
      setLog([...newLog, { sender: 'Hans', text: "Puh, das weiß ich noch nicht. Was soll ich das nächste Mal darauf antworten?" }]);
    }
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
            placeholder={learningKeyword ? "Tippe die Antwort ein..." : "Schreibe eine Nachricht..."} 
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#2a2a2a', color: '#fff', fontSize: '1rem' }}
          />
          <button onClick={sendMessage} style={{ padding: '0 20px', background: learningKeyword ? '#2ed573' : '#ff6b6b', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            {learningKeyword ? 'Speichern' : 'Senden'}
          </button>
        </div>
      </div>
    </main>
    
  );
}
