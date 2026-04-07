import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Activity, Trash2, Clock } from 'lucide-react';
import { getThreatLogs, clearThreatLogs } from '../utils/threatLog';

const ThreatLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Initial load
    setLogs(getThreatLogs());

    // Listen for updates
    const handleUpdate = () => {
      setLogs(getThreatLogs());
    };

    window.addEventListener('cyberLensLogUpdated', handleUpdate);
    return () => window.removeEventListener('cyberLensLogUpdated', handleUpdate);
  }, []);

  const totalScans = logs.length;
  const maliciousCount = logs.filter(log => log.status === 'Malicious' || log.status === 'Danger').length;
  const safeCount = totalScans - maliciousCount;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">Threat Intelligence Log</h1>
          <p className="page-subtitle">Centralized dashboard of all analysis events and identified threats.</p>
        </div>
        {logs.length > 0 && (
          <button className="btn-danger" onClick={clearThreatLogs} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            <Trash2 size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> 
            Clear Logs
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '12px' }}>
            <Activity size={32} color="var(--accent-blue)" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Total Scans</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#fff' }}>{totalScans}</div>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(255, 59, 59, 0.1)', padding: '16px', borderRadius: '12px' }}>
            <ShieldAlert size={32} color="var(--accent-red)" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Threats Blocked</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent-red)' }}>{maliciousCount}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(0, 255, 163, 0.1)', padding: '16px', borderRadius: '12px' }}>
            <Shield size={32} color="var(--accent-green)" />
          </div>
          <div>
             <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Safe Entities</div>
             <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent-green)' }}>{safeCount}</div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={20} color="var(--text-muted)" />
          <h3 style={{ margin: 0, fontWeight: 500 }}>Recent Activity</h3>
        </div>
        
        {logs.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No scanning activity recorded yet. Run a file, URL, or QR scan.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Time</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Event Type</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Target</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Details</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderTop: '1px solid var(--border-light)', transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.02)' } }}>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: 500 }}>
                      {log.type.replace('_', ' ')}
                    </td>
                    <td style={{ padding: '16px 24px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.target}
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {log.details}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem', 
                        fontWeight: 600,
                        background: (log.status === 'Malicious' || log.status === 'Danger') ? 'rgba(255, 59, 59, 0.15)' : 'rgba(0, 255, 163, 0.15)',
                        color: (log.status === 'Malicious' || log.status === 'Danger') ? 'var(--accent-red)' : 'var(--accent-green)',
                        border: `1px solid ${(log.status === 'Malicious' || log.status === 'Danger') ? 'var(--accent-red)' : 'var(--accent-green)'}` 
                      }}>
                        {log.status === 'Clean' || log.status === 'Safe' ? 'SAFE' : 'THREAT'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatLog;
