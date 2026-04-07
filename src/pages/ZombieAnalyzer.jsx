import React, { useState } from 'react';
import { Network, ShieldAlert, ShieldCheck, Activity, Globe, WifiOff } from 'lucide-react';
import { addThreatLog } from '../utils/threatLog';

const ZombieAnalyzer = () => {
  const [target, setTarget] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!target.trim()) return;

    setIsScanning(true);
    setResult(null);

    // Simulate network telemetry scan
    setTimeout(() => {
      setIsScanning(false);
      
      const lowerTarget = target.toLowerCase();
      // Basic heuristics: if it contains 'bot', 'cnc', 'c2', or a specific IP block pattern
      const isDangerous = lowerTarget.includes('bot') || lowerTarget.includes('c2') || lowerTarget.startsWith('10.0.0.9');
      const score = isDangerous ? Math.floor(Math.random() * 15 + 85) : Math.floor(Math.random() * 5);
      
      const scanResult = {
        target: target,
        status: isDangerous ? 'Danger' : 'Safe',
        score: score,
        family: isDangerous ? (lowerTarget.includes('c2') ? 'Qakbot/C2' : 'Mirai Variant') : 'N/A',
        activity: isDangerous ? 'High Frequency Beaconing detected' : 'Standard Baseline Traffic',
      };
      
      setResult(scanResult);
      
      addThreatLog({
        type: 'ZOMBIE_DETECTED',
        target: target,
        status: isDangerous ? 'Malicious' : 'Clean',
        details: `Risk: ${score}/100. Family: ${scanResult.family}`
      });
      
    }, 2800);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="page-header">
        <h1 className="page-title">Zombie & Botnet Analyzer</h1>
        <p className="page-subtitle">Track C2 beaconing and evaluate device telemetry for botnet compromise.</p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Network size={20} />
            </div>
            <input 
              type="text" 
              className="input-glass" 
              placeholder="Enter IP Address, Hostname, or Network Segment..." 
              style={{ paddingLeft: '48px', fontSize: '1.1rem' }}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={isScanning}>
            {isScanning ? (
              <><Activity className="animate-pulse-glow" size={18} style={{ borderRadius: '50%' }} /> ANALYZING...</>
            ) : (
              <><WifiOff size={18} /> CHECK TELEMETRY</>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="glass-panel animate-fade-in" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px' }}>
            {result.status === 'Safe' ? (
              <ShieldCheck size={48} color="var(--accent-green)" />
            ) : (
              <ShieldAlert size={48} color="var(--accent-red)" className="animate-pulse-glow" style={{ borderRadius: '50%', boxShadow: 'var(--shadow-glow-red)' }} />
            )}
            <div>
              <h2 style={{ wordBreak: 'break-all' }}>Target: {result.target}</h2>
              <div style={{ color: result.status === 'Safe' ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: '600', fontSize: '1.2rem', marginTop: '4px' }}>
                Verdict: {result.status === 'Safe' ? 'Uncompromised' : 'Compromised (Zombie)'} (Score: {result.score}/100)
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
             <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Globe size={24} color={result.status === 'Safe' ? 'var(--accent-green)' : 'var(--accent-red)'} />
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Traffic Baseline</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{result.activity}</div>
              </div>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Network size={24} color={result.status === 'Safe' ? 'var(--text-muted)' : 'var(--accent-yellow)'} />
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Malware Family</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{result.family}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZombieAnalyzer;
