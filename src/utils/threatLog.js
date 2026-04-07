export const getThreatLogs = () => {
  const logs = localStorage.getItem('cyberLensLogs');
  return logs ? JSON.parse(logs) : [];
};

export const addThreatLog = (log) => {
  const logs = getThreatLogs();
  const newLog = {
    ...log,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  };
  const updatedLogs = [newLog, ...logs];
  localStorage.setItem('cyberLensLogs', JSON.stringify(updatedLogs));
  // Dispatch a custom event so other components can refresh
  window.dispatchEvent(new Event('cyberLensLogUpdated'));
  return newLog;
};

export const clearThreatLogs = () => {
  localStorage.removeItem('cyberLensLogs');
  window.dispatchEvent(new Event('cyberLensLogUpdated'));
};
