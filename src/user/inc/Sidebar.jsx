import React, { useState, useEffect, useRef } from 'react';
import logo from '../../assets/images/cattivo-logo.png';
import { NavLink, useLocation } from 'react-router-dom';
import { authUser } from '../../helper/Utility';
import { SVGCollaboration, SVGDashboard, SVGInsights, SVGSales } from '../../helper/svgIcon';
import { appMenu } from '../../routes/routesConfig';
import { useTranslation } from '../../helper/useTranslation';

// ✅ Moved OUTSIDE Sidebar — no more remount on every render
const AccordionItem = ({ title, icon, isOpen, onToggle, children }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(() => isOpen ? 'auto' : 0); // ✅ init correctly

  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      // Measure actual height then set it, then switch to 'auto'
      const scrollHeight = contentRef.current.scrollHeight;
      setHeight(scrollHeight);
      const timer = setTimeout(() => setHeight('auto'), 350); // after transition ends
      return () => clearTimeout(timer);
    } else {
      // Snap from 'auto' to measured px first, THEN animate to 0
      const scrollHeight = contentRef.current.scrollHeight;
      setHeight(scrollHeight);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight(0));
      });
    }
  }, [isOpen]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          marginBottom: '8px',
          cursor: 'pointer',
          borderRadius: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon && (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {icon}
            </span>
          )}
          <p
            style={{
              textTransform: 'uppercase',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              margin: 0,
            }}
          >
            {title}
          </p>
        </div>
        <i
          className={`bi bi-${isOpen ? 'dash-lg' : 'plus-lg'}`}
          style={{ color: '#fff', fontSize: '12px' }}
        />
      </div>

      <div
        style={{
          height: height === 'auto' ? 'auto' : `${height}px`,
          overflow: 'hidden',
          // ✅ Only animate when NOT 'auto' (avoids snap on initial load)
          transition: height === 'auto' ? 'none' : 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className='left_submenu' ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ✅ Moved OUTSIDE Sidebar
const NavItem = ({ item, closeSidebar }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const toPath = item.navPath || item.path;
  const isActive = location.pathname === toPath;

  return (
    <NavLink
      to={toPath}
      onClick={closeSidebar}
      style={{ textDecoration: 'none', display: 'block', marginBottom: '2px' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 12px',
          marginLeft: '8px',
          borderRadius: '8px',
          background: isActive ? '#fff' : 'transparent',
          color: isActive ? '#000' : '#fff',
          fontSize: '13px',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = '#1a1a1a';
            e.currentTarget.style.transform = 'translateX(4px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'translateX(0)';
          }
        }}
      >
        <i
          className={`bi ${item.icon}`}
          style={{
            fontSize: '16px',
            color: isActive ? '#000' : '#fff',
            width: '20px',
            transition: 'all 0.2s ease',
          }}
        />
        <span style={{ flex: 1 }}>{t(item.label)}</span>
        {item.badge && (
          <span
            style={{
              background: isActive ? '#000' : '#d12026',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 'bold',
              borderRadius: '10px',
              padding: '0px 6px',
              minWidth: '18px',
              textAlign: 'center',
              lineHeight: '16px',
            }}
          >
            {item.badge}
          </span>
        )}
      </div>
    </NavLink>
  );
};

const Sidebar = () => {
  const AUTH_LOCAL_INFO = authUser();
  const role = AUTH_LOCAL_INFO?.role;
  const { t } = useTranslation();
  const location = useLocation();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [openIndexes, setOpenIndexes] = useState([]);
  const [initialized, setInitialized] = useState(false);

  const filteredMenu = appMenu.filter(menu => menu.roles.includes(role));

  useEffect(() => {
    if (!initialized && filteredMenu.length > 0) {
      setOpenIndexes(filteredMenu.map((_, index) => index));
      setInitialized(true);
    }
  }, [filteredMenu, initialized]);

  const toggleAccordion = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);
  const closeSidebar = () => { if (isMobile) setIsMobileOpen(false); };

  const svgIcons = {
    dashboard: <SVGDashboard />,
    users: <SVGSales />,
    styles: <SVGInsights />,
  };

  return (
    <>
      {isMobile && isMobileOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 1040,
            animation: 'fadeIn 0.3s ease',
          }}
        />
      )}

      <div
        style={{
          width: '260px', background: '#0F0F0F',
          borderRight: '1px solid #1a1a1a', height: '100vh',
          position: 'fixed', top: 0,
          left: isMobile ? (isMobileOpen ? '0' : '-260px') : '0',
          zIndex: 1050, boxShadow: '2px 0 8px rgba(0,0,0,0.3)',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px', borderBottom: '1px solid #1a1a1a',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <img src={logo} alt="website_logo" style={{ height: '52px' }} />
          </div>
          {isMobile && (
            <i
              className="bi bi-x-lg" onClick={toggleSidebar}
              style={{ color: '#d12026', cursor: 'pointer', fontSize: '18px' }}
            />
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '20px 16px', overflowY: 'auto' }}>
          {filteredMenu.map((menu, index) => {
            if (menu.type === 'single') {
              return menu.children
                .filter(item => !item.hideInMenu)
                .map(item => (
                  <NavItem key={item.path} item={item} closeSidebar={closeSidebar} />
                ));
            }

            return (
              <AccordionItem
                key={menu.title} // ✅ stable key (not index)
                title={t(menu.title)}
                icon={svgIcons[menu.icon]}
                isOpen={openIndexes.includes(index)}
                onToggle={() => toggleAccordion(index)}
              >
                {menu.children
                  .filter(item => !item.hideInMenu)
                  .map(item => (
                    <NavItem key={item.path} item={item} closeSidebar={closeSidebar} />
                  ))}
              </AccordionItem>
            );
          })}
        </nav>

        {/* User */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '16px', borderTop: '1px solid #1a1a1a', background: '#0F0F0F',
          }}
        >
          <div
            style={{
              width: '36px', height: '36px', background: '#D12026',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontSize: '14px',
              fontWeight: 'bold', flexShrink: 0,
            }}
          >
            D
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 600, color: '#fff', fontSize: '13px' }}>
              {AUTH_LOCAL_INFO?.name}
            </p>
            <p className='text-capitalize' style={{ margin: 0, color: '#d12026', fontSize: '11px' }}>
              {AUTH_LOCAL_INFO?.role}
            </p>
          </div>
        </div>
      </div>

      {isMobile && !isMobileOpen && (
        <button
          onClick={toggleSidebar}
          style={{
            position: 'fixed', top: '25px', left: '15px', zIndex: 1040,
            background: '#d12026', border: 'none', borderRadius: '8px',
            width: '30px', height: '30px', color: '#fff', cursor: 'pointer',
          }}
        >
          <i className="bi bi-list" style={{ fontSize: '20px' }} />
        </button>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #1a1a1a; }
        ::-webkit-scrollbar-thumb { background: #343434; border-radius: 4px; }
      `}</style>
    </>
  );
};

export default Sidebar;