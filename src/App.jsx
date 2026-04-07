import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ThreatLog from './pages/ThreatLog';
import FileAnalysis from './pages/FileAnalysis';
import UrlScanner from './pages/UrlScanner';
import QrDecoder from './pages/QrDecoder';
import PromptInjection from './pages/PromptInjection';
import ZombieAnalyzer from './pages/ZombieAnalyzer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ThreatLog />} />
          <Route path="file" element={<FileAnalysis />} />
          <Route path="url" element={<UrlScanner />} />
          <Route path="qr" element={<QrDecoder />} />
          <Route path="prompt-injection" element={<PromptInjection />} />
          <Route path="zombie" element={<ZombieAnalyzer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
