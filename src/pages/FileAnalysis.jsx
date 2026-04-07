import React, { useState, useCallback, useEffect } from 'react';
import { UploadCloud, File, ShieldAlert, ShieldCheck, Activity } from 'lucide-react';
import { addThreatLog } from '../utils/threatLog';

const FileAnalysis = () => {
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, []);
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
    setProgress(0);
    setIsScanning(false);
  };

  const startScan = () => {
    if (!file) return;
    setIsScanning(true);
    setProgress(0);
    
    // Simulate scan steps
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          finishScan();
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 400);
  };
  
  const finishScan = () => {
    setIsScanning(false);
    
    // Generate deterministic mock results based on file name length to feel somewhat "real"
    const isSuspicious = file.name.includes('exe') || file.name.includes('script') || file.size < 1000;
    const entropy = (Math.random() * 3 + 4).toFixed(2);
    
    const scanResult = {
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      entropy: entropy,
      signature: isSuspicious ? 'Suspicious pattern matched' : 'Known Good (Clean)',
      status: isSuspicious ? 'Danger' : 'Safe',
      score: isSuspicious ? Math.floor(Math.random() * 30 + 70) : Math.floor(Math.random() * 10), // 0-100 risk score
    };
    
    setResult(scanResult);
    
    // Log threat
    addThreatLog({
      type: 'FILE_SCAN',
      target: file.name,
      status: scanResult.status,
      details: `Risk Score: ${scanResult.score}/100. Entropy: ${entropy}`
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="page-header">
        <h1 className="page-title">File Analysis Engine</h1>
        <p className="page-subtitle">Perform deep static and dynamic behavioral analysis on suspicious files.</p>
      </div>
      
      {!result && !isScanning && (
        <div 
          className="glass-panel" 
          style={{ 
            padding: '60px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderStyle: 'dashed',
            borderWidth: '2px',
            borderColor: file ? 'var(--accent-cyan)' : 'var(--border-light)',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <input 
            type="file" 
            id="file-upload" 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
          />
          <UploadCloud size={64} color="var(--text-secondary)" style={{ marginBottom: '16px' }} />
          {file ? (
            <h3 style={{ color: 'var(--accent-cyan)' }}>Selected: {file.name}</h3>
          ) : (
            <>
              <h3>Drag and drop your file here</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>or click to browse from your computer</p>
            </>
          )}
        </div>
      )}

      {file && !isScanning && !result && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="btn-primary" onClick={startScan}>
            <Activity size={18} /> INITIALIZE SCAN
          </button>
        </div>
      )}

      {isScanning && (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Activity className="animate-pulse-glow" style={{ borderRadius: '50%' }} color="var(--accent-cyan)" /> 
            Analyzing {file?.name}...
          </h3>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-cyan)', transition: 'width 0.3s ease' }}></div>
          </div>
          <p style={{ marginTop: '16px', color: 'var(--accent-cyan)' }}>{progress}% Complete</p>
        </div>
      )}

      {result && (
        <div className="glass-panel animate-fade-in" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px' }}>
            {result.status === 'Safe' ? (
              <ShieldCheck size={48} color="var(--accent-green)" />
            ) : (
              <ShieldAlert size={48} color="var(--accent-red)" className="animate-pulse-glow" style={{ borderRadius: '50%', boxShadow: 'var(--shadow-glow-red)' }} />
            )}
            <div>
              <h2>{result.name}</h2>
              <div style={{ color: result.status === 'Safe' ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: '600', fontSize: '1.2rem', marginTop: '4px' }}>
                Status: {result.status} (Risk Score: {result.score}/100)
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>File Size</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>{result.size}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Shannon Entropy</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '500', color: parseFloat(result.entropy) > 7 ? 'var(--accent-red)' : 'inherit' }}>
                {result.entropy} {parseFloat(result.entropy) > 7 ? '(High / Packed)' : ''}
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Static Signature</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{result.signature}</div>
            </div>
          </div>
          
          <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
             <button className="btn-primary" onClick={() => handleFileSelection(null)}>
               Scan Another File
             </button>
             {result.status !== 'Safe' && (
               <button className="btn-danger">
                 Quarantine File
               </button>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileAnalysis;
