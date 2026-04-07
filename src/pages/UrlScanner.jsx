import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, Globe, Lock, AlertTriangle } from 'lucide-react';
import { addThreatLog } from '../utils/threatLog';

const UrlScanner = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    // basic validation to ensure it has a protocol or just something url-like
    const scanUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
    
    setIsScanning(true);
    setResult(null);

    // Simulate network delay for scan
    setTimeout(() => {
      setIsScanning(false);
      
      const isDangerous = scanUrl.includes('test') || scanUrl.includes('malware') || scanUrl.includes('phishing');
      const score = isDangerous ? Math.floor(Math.random() * 30 + 70) : Math.floor(Math.random() * 15);
      
      const scanResult = {
        url: scanUrl,
        status: isDangerous ? 'Malicious' : 'Clean',
        score: score,
        domainAge: isDangerous ? '12 Days' : '5+ Years',
        ssl: isDangerous ? 'Invalid / Self-Signed' : 'Valid (RSA 2048-bit)',
        category: isDangerous ? 'Phishing / Deceptive' : 'Safe / Business',
      };
      
      setResult(scanResult);
      
      addThreatLog({
        type: 'URL_SCAN',
        target: scanUrl,
        status: scanResult.status,
        details: `Risk: ${score}/100. Category: ${scanResult.category}`
      });
      
    }, 2500);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="page-header">
        <h1 className="page-title">URL & Domain Scanner</h1>
        <p className="page-subtitle">Real-time threat intelligence blocklist check and domain reputation analysis.</p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Globe size={20} />
            </div>
            <input 
              type="text" 
              className="input-glass" 
              placeholder="Enter URL, IP address, or domain (e.g., https://example.com)..." 
              style={{ paddingLeft: '48px', fontSize: '1.1rem' }}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={isScanning}>
            {isScanning ? (
              <><Globe className="animate-pulse-glow" size={18} style={{ borderRadius: '50%' }} /> SCANNING</>
            ) : (
              <><Search size={18} /> ANALYZE URL</>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="glass-panel animate-fade-in" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px' }}>
            {result.status === 'Clean' ? (
              <ShieldCheck size={48} color="var(--accent-green)" />
            ) : (
              <ShieldAlert size={48} color="var(--accent-red)" className="animate-pulse-glow" style={{ borderRadius: '50%', boxShadow: 'var(--shadow-glow-red)' }} />
            )}
            <div>
              <h2 style={{ wordBreak: 'break-all' }}>{result.url}</h2>
              <div style={{ color: result.status === 'Clean' ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: '600', fontSize: '1.2rem', marginTop: '4px' }}>
                Outcome: {result.status} (Score: {result.score}/100)
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
             <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Lock size={24} color={result.status === 'Clean' ? 'var(--accent-green)' : 'var(--accent-red)'} />
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>SSL Certificate</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{result.ssl}</div>
              </div>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Globe size={24} color="var(--accent-cyan)" />
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Domain Age</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{result.domainAge}</div>
              </div>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertTriangle size={24} color={result.status === 'Clean' ? 'var(--text-muted)' : 'var(--accent-yellow)'} />
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Threat Category</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{result.category}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlScanner;
