import React, {
  useState,
  useEffect,
} from 'react';

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener(
      'resize',
      handleResize
    );

    return () =>
      window.removeEventListener(
        'resize',
        handleResize
      );
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((previous) => !previous);
  };

  return (
    <div className="app-container">

      <Navbar
        onToggleSidebar={toggleSidebar}
      />

      <Sidebar
        collapsed={sidebarCollapsed}
      />

      <main
        className={`main-content ${
          sidebarCollapsed
            ? 'collapsed'
            : ''
        }`}
      >
        <div
          className="animate-fade-in"
          style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </div>

        <Footer />

      </main>

    </div>
  );
};

export default Layout;