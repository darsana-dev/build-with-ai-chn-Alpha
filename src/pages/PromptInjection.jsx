import React, { useState } from 'react';
import { MessageSquare, ShieldAlert, ShieldCheck, Cpu, Code, AlertTriangle } from 'lucide-react';
import { addThreatLog } from '../utils/threatLog';

const PromptInjection = () => {
  const [prompt, setPrompt] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsScanning(true);
    setResult(null);

    // Simulate LLM heuristics scan
    setTimeout(() => {
      setIsScanning(false);
      
      const lowerPrompt = prompt.toLowerCase();
      // Heuristics for jailbreaks
      const hasIgnore = lowerPrompt.includes('ignore previous') || lowerPrompt.includes('forget your instructions');
      const hasDAN = lowerPrompt.includes('do anything now') || lowerPrompt.includes('dan mode');
      const hasSystem = lowerPrompt.includes('system prompt') || lowerPrompt.includes('you are a');
      
      const isDangerous = hasIgnore || hasDAN || hasSystem;
      const score = isDangerous ? Math.floor(Math.random() * 20 + 80) : Math.floor(Math.random() * 10);
      
      let category = 'Benign';
      if (hasDAN) category = 'Jailbreak (DAN)';
      else if (hasIgnore) category = 'Injection (Instruction Override)';
      else if (hasSystem) category = 'System Prompt Extraction';
      
      const scanResult = {
        promptSnippet: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
        status: isDangerous ? 'Malicious' : 'Clean',
        score: score,
        category: category,
        confidence: isDangerous ? 'High' : 'Very High'
      };
      
      setResult(scanResult);
      
      addThreatLog({
        type: 'PROMPT_INJECT',
        target: 'LLM Gateway',
        status: scanResult.status,
        details: `Risk: ${score}/100. Category: ${scanResult.category}`
      });
      
    }, 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="page-header">
        <h1 className="page-title">Prompt Injection Scanner</h1>
        <p className="page-subtitle">Analyze LLM inputs for jailbreaks, system extraction, and malicious overrides.</p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <textarea 
              className="input-glass" 
              placeholder="Paste the target prompt here..." 
              style={{ padding: '16px', fontSize: '1.1rem', minHeight: '150px', resize: 'vertical' }}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }} disabled={isScanning}>
            {isScanning ? (
              <><Cpu className="animate-pulse-glow" size={18} style={{ borderRadius: '50%' }} /> ANALYZING...</>
            ) : (
              <><MessageSquare size={18} /> SCAN PROMPT</>
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
              <h2 style={{ wordBreak: 'break-all' }}>Analysis Complete</h2>
              <div style={{ color: result.status === 'Clean' ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: '600', fontSize: '1.2rem', marginTop: '4px' }}>
                Outcome: {result.status} (Heuristic Score: {result.score}/100)
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
             <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Code size={24} color="var(--text-secondary)" />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Snippet Checked</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '500', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    "{result.promptSnippet}"
                </div>
              </div>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertTriangle size={24} color={result.status === 'Clean' ? 'var(--text-muted)' : 'var(--accent-yellow)'} />
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Threat Category</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{result.category}</div>
              </div>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Cpu size={24} color="var(--accent-cyan)" />
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Scanner Confidence</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{result.confidence}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptInjection;
