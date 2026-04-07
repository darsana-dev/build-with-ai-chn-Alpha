import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Shield, FileSearch, Link, QrCode, Activity, MessageSquare, Network } from 'lucide-react';

const Layout = () => {
  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Shield color="var(--accent-cyan)" size={28} />
          <div>Cyber<span>Lens</span></div>
        </div>
        
        <nav className="nav-links">
          <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} end>
            <Activity size={20} />
            Threat Log
          </NavLink>
          <NavLink to="/file" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <FileSearch size={20} />
            File Analysis
          </NavLink>
          <NavLink to="/url" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <Link size={20} />
            URL Scanner
          </NavLink>
          <NavLink to="/qr" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <QrCode size={20} />
            QR Decoder
          </NavLink>
          <NavLink to="/prompt-injection" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <MessageSquare size={20} />
            Prompt Injection
          </NavLink>
          <NavLink to="/zombie" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <Network size={20} />
            Botnet Analyzer
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
