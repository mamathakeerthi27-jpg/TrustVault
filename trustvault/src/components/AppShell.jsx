import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell({ title, breadcrumbs }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div
        className="app-main-content"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          marginLeft: '260px',
          transition: 'margin-left var(--transition-normal)'
        }}
      >
        <Topbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={title}
          breadcrumbs={breadcrumbs}
        />

        <main style={{ flex: 1, padding: '28px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .app-main-content {
            margin-left: 0 !important;
          }
        }
        @media (max-width: 640px) {
          main {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
