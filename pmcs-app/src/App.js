import React, { useState } from 'react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const trucks = [
  { id: 'TK-0041', driver: 'Emmanuel Okafor', location: 'Apapa Terminal, Lagos', status: 'In Transit' },
  { id: 'TK-0089', driver: 'Musa Aliyu',      location: 'Kaduna Refinery',       status: 'Delivered'  },
  { id: 'TK-0117', driver: 'Chukwuemeka Eze', location: 'Port Harcourt Depot',   status: 'Alert'      },
  { id: 'TK-0203', driver: 'Adewale Bello',   location: 'Kano Distribution Hub', status: 'In Transit' },
  { id: 'TK-0256', driver: 'Fatima Suleiman', location: 'Abuja Central Depot',   status: 'Delivered'  },
];

const alerts = [
  { id: 'ALT-001', time: '08:14 AM', truck: 'TK-0117', type: 'Route Deviation',      severity: 'High',   desc: 'Truck deviated 12 km from authorized transit corridor' },
  { id: 'ALT-002', time: '09:02 AM', truck: 'TK-0041', type: 'Unauthorized Stop',    severity: 'High',   desc: 'Vehicle halted outside designated waypoint for 27 mins' },
  { id: 'ALT-003', time: '10:30 AM', truck: 'TK-0203', type: 'Volume Mismatch',      severity: 'Medium', desc: 'Delivered volume 3.4% below manifested quantity at checkpoint' },
  { id: 'ALT-004', time: '11:15 AM', truck: 'TK-0089', type: 'Seal Integrity Alert', severity: 'Medium', desc: 'Compartment seal tag scan mismatch detected at Kaduna checkpoint' },
  { id: 'ALT-005', time: '12:48 PM', truck: 'TK-0256', type: 'Geofence Exit',        severity: 'Low',    desc: 'Brief geofence boundary crossing — auto-resolved by system' },
];

const logs = [
  { truck: 'TK-0041', route: 'LAG-ABJ-001', from: 'Apapa Terminal',   to: 'Abuja Depot',     expected: '33,000 L', delivered: '—',        status: 'In Transit' },
  { truck: 'TK-0089', route: 'KAD-KNO-004', from: 'Kaduna Refinery',  to: 'Kano Hub',        expected: '30,000 L', delivered: '30,000 L', status: 'Delivered'  },
  { truck: 'TK-0117', route: 'PHC-WAR-007', from: 'Port Harcourt',    to: 'Warri Terminal',  expected: '45,000 L', delivered: '—',        status: 'Alert'      },
  { truck: 'TK-0203', route: 'KNO-SKT-002', from: 'Kano Hub',         to: 'Sokoto Depot',    expected: '28,500 L', delivered: '—',        status: 'In Transit' },
  { truck: 'TK-0256', route: 'ABJ-MKD-003', from: 'Abuja Central',    to: 'Makurdi Station', expected: '36,000 L', delivered: '36,000 L', status: 'Delivered'  },
];

const flowSteps = [
  { label: 'Zone A Dispatch', sub: 'Apapa Terminal',    icon: '🏭', done: true,  active: false },
  { label: 'In Transit',      sub: 'Route LAG-ABJ-001', icon: '🚛', done: false, active: true  },
  { label: 'Zone B Verify',   sub: 'Abuja Checkpoint',  icon: '🔍', done: false, active: false },
  { label: 'Completed',       sub: 'Delivery Confirmed',icon: '✅', done: false, active: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusBadge = (status) => {
  const map = {
    'Delivered':  'bg-green-100 text-green-800 border border-green-300',
    'In Transit': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    'Alert':      'bg-red-100 text-red-800 border border-red-300',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

const severityConfig = {
  High:   { bar: 'bg-red-500',    badge: 'bg-red-100 text-red-800 border border-red-300'       },
  Medium: { bar: 'bg-orange-400', badge: 'bg-orange-100 text-orange-800 border border-orange-300' },
  Low:    { bar: 'bg-blue-400',   badge: 'bg-blue-100 text-blue-800 border border-blue-300'     },
};

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ activeNav, setActiveNav }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = ['Dashboard', 'Tracking', 'Reports', 'Alerts'];

  return (
    <nav style={{ backgroundColor: '#0D1B2A' }} className="shadow-2xl sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <img src="/pmcs-logo.png" alt="PMCS Logo" className="h-10 w-10 object-contain" />
            <div>
              <div className="text-white font-black text-lg tracking-widest leading-none">PMCS</div>
              <div style={{ color: '#F59E0B' }} className="text-xs font-semibold tracking-wider uppercase leading-none mt-0.5">
                Petroleum Movement &amp; Logistics Control
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-150"
                style={{
                  backgroundColor: activeNav === item ? '#0F7A3D' : 'transparent',
                  color: activeNav === item ? '#fff' : '#d1d5db',
                }}
              >
                {item}
              </button>
            ))}
            {/* Landing page link */}
            <a
              href="/"
              className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 border"
              style={{ color: '#0F7A3D', borderColor: '#0F7A3D', backgroundColor: 'transparent' }}
            >
              ← View Site
            </a>

            {/* Avatar */}
            <div className="ml-2 flex items-center gap-2 cursor-pointer">
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm shadow-md"
                style={{ backgroundColor: '#F59E0B', color: '#0D1B2A' }}
              >
                AD
              </div>
              <div className="hidden lg:block text-right">
                <div className="text-white text-xs font-semibold">Admin Officer</div>
                <div className="text-gray-400 text-xs">DPR Regulator</div>
              </div>
            </div>
          </div>

          {/* Hamburger */}
          <button className="md:hidden text-gray-300 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-gray-700">
            {navItems.map(item => (
              <button
                key={item}
                onClick={() => { setActiveNav(item); setMenuOpen(false); }}
                className="block w-full text-left px-4 py-2.5 text-sm font-medium"
                style={{ color: activeNav === item ? '#F59E0B' : '#d1d5db' }}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Hero / KPI Section ───────────────────────────────────────────────────────

function KPICard({ icon, label, value, change, changeUp }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex items-start gap-4 border border-gray-100">
      <div
        className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ backgroundColor: '#0D1B2A' }}
      >
        {icon}
      </div>
      <div>
        <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{label}</div>
        <div className="text-3xl font-black mt-0.5" style={{ color: '#0D1B2A' }}>{value}</div>
        <div className="text-xs font-medium mt-1" style={{ color: changeUp ? '#0F7A3D' : '#dc2626' }}>
          {changeUp ? '▲' : '▼'} {change}
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section
      className="py-10 px-4 sm:px-6 lg:px-8"
      style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #162236 60%, #1E3048 100%)' }}
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 border"
          style={{ backgroundColor: 'rgba(15,122,61,0.15)', borderColor: 'rgba(15,122,61,0.4)' }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#0F7A3D' }}></span>
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: '#0F7A3D' }}>
            System Live — 18 Apr 2026
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
          National Petroleum Monitoring<br className="hidden sm:block" />
          &amp; Compliance Platform
        </h1>
        <p className="font-bold text-base sm:text-lg mt-2 tracking-widest uppercase" style={{ color: '#F59E0B' }}>
          Track. Verify. Control. Secure.
        </p>
        <p className="text-gray-400 text-sm mt-2 max-w-xl">
          Real-time surveillance of petroleum movement across all national depots, transit routes, and delivery zones — regulated by DPR.
        </p>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <KPICard icon="🚛" label="Active Trucks"    value="1,245" change="4.2% vs yesterday" changeUp={true}  />
          <KPICard icon="📦" label="Deliveries Today" value="320"   change="12 pending"        changeUp={true}  />
          <KPICard icon="🚨" label="Alerts Triggered" value="18"    change="3 unresolved"      changeUp={false} />
        </div>
      </div>
    </section>
  );
}

// ─── Live Tracking Section ────────────────────────────────────────────────────

function MockMap() {
  const pins = [
    { x: '18%', y: '72%', id: 'TK-0041', status: 'In Transit' },
    { x: '38%', y: '28%', id: 'TK-0089', status: 'Delivered'  },
    { x: '22%', y: '80%', id: 'TK-0117', status: 'Alert'      },
    { x: '44%', y: '18%', id: 'TK-0203', status: 'In Transit' },
    { x: '34%', y: '44%', id: 'TK-0256', status: 'Delivered'  },
  ];
  const pinColor = { 'In Transit': '#F59E0B', 'Delivered': '#0F7A3D', 'Alert': '#EF4444' };

  return (
    <div className="relative w-full h-full" style={{ minHeight: 300, backgroundColor: '#0D1B2A', borderRadius: 12 }}>
      {/* Grid SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4A90D9" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapgrid)" />
      </svg>

      {/* Road network */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid slice">
        <path d="M80 260 Q200 200 250 140 Q290 90 400 70 Q470 55 550 60" stroke="#1E4A6E" strokeWidth="3" fill="none" strokeDasharray="8,4" />
        <path d="M80 260 Q180 220 290 190 Q360 175 440 180" stroke="#1E4A6E" strokeWidth="3" fill="none" strokeDasharray="8,4" />
        <path d="M250 140 L290 190 L330 250" stroke="#1E4A6E" strokeWidth="2" fill="none" strokeDasharray="6,3" />
        <path d="M400 70 L360 175" stroke="#1E4A6E" strokeWidth="2" fill="none" strokeDasharray="6,3" />
        <path d="M0 180 Q150 160 300 175 Q450 190 600 165" stroke="#0F3460" strokeWidth="8" fill="none" opacity="0.5" />
        <text x="20" y="310" fill="#1E3A5F" fontSize="11" fontFamily="monospace" opacity="0.8">Nigeria — Federal Petroleum Grid</text>
        <text x="430" y="310" fill="#1E3A5F" fontSize="9" fontFamily="monospace" opacity="0.5">PMCS v2.1</text>
      </svg>

      {/* Truck pins */}
      {pins.map(p => (
        <div
          key={p.id}
          className="absolute group"
          style={{ left: p.x, top: p.y, transform: 'translate(-50%, -100%)' }}
        >
          {p.status === 'Alert' && (
            <span
              className="absolute animate-ping rounded-full opacity-50"
              style={{ width: 20, height: 20, top: -2, left: -2, backgroundColor: '#EF4444' }}
            ></span>
          )}
          <div
            className="w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
            style={{ backgroundColor: pinColor[p.status] }}
          >
            <span className="text-white font-black" style={{ fontSize: 8 }}>T</span>
          </div>
          {/* Tooltip */}
          <div
            className="absolute opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap text-white rounded-md px-2 py-1 shadow-xl border"
            style={{
              bottom: 28, left: '50%', transform: 'translateX(-50%)',
              backgroundColor: '#0D1B2A', borderColor: '#1E4A6E', fontSize: 10,
            }}
          >
            <div className="font-bold">{p.id}</div>
            <div style={{ color: pinColor[p.status] }}>{p.status}</div>
          </div>
        </div>
      ))}

      {/* Legend */}
      <div
        className="absolute bottom-3 right-3 rounded-lg p-2 border text-gray-300"
        style={{ backgroundColor: 'rgba(13,27,42,0.92)', borderColor: '#1E4A6E', fontSize: 10 }}
      >
        {[['In Transit','#F59E0B'],['Delivered','#0F7A3D'],['Alert','#EF4444']].map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5 mb-0.5 last:mb-0">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, display: 'inline-block' }}></span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function TruckCard({ truck }) {
  const dotColor = { 'Delivered': '#22c55e', 'In Transit': '#eab308', 'Alert': '#ef4444' };
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-black text-sm" style={{ color: '#0D1B2A' }}>{truck.id}</div>
          <div className="text-gray-500 text-xs mt-0.5">{truck.driver}</div>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${statusBadge(truck.status)}`}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor[truck.status], display: 'inline-block' }}></span>
          {truck.status}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
        <svg className="w-3 h-3 flex-shrink-0" fill="#F59E0B" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <span className="truncate">{truck.location}</span>
      </div>
    </div>
  );
}

function TrackingSection() {
  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black" style={{ color: '#0D1B2A' }}>Live Tanker Tracking</h2>
          <p className="text-gray-500 text-sm mt-0.5">Real-time position data — refreshed every 30 seconds</p>
        </div>
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1 border"
          style={{ backgroundColor: 'rgba(15,122,61,0.1)', borderColor: 'rgba(15,122,61,0.3)' }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#0F7A3D' }}></span>
          <span className="text-xs font-semibold" style={{ color: '#0F7A3D' }}>LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg border border-gray-200" style={{ minHeight: 320 }}>
          <MockMap />
        </div>
        {/* Truck list */}
        <div className="space-y-3">
          {trucks.map(t => <TruckCard key={t.id} truck={t} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Flow Section ─────────────────────────────────────────────────────────────

function FlowSection() {
  return (
    <section className="bg-white border-y border-gray-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-black" style={{ color: '#0D1B2A' }}>Petroleum Movement Flow</h2>
          <p className="text-gray-500 text-sm mt-0.5">Chain-of-custody tracking — TK-0041 / LAG-ABJ-001</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2">
          {flowSteps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div
                className="flex flex-col items-center text-center flex-1 p-5 rounded-2xl border-2 w-full sm:w-auto transition-all"
                style={
                  step.active
                    ? { backgroundColor: '#0D1B2A', borderColor: '#F59E0B', transform: 'scale(1.04)', boxShadow: '0 8px 32px rgba(245,158,11,0.15)' }
                    : step.done
                      ? { backgroundColor: 'rgba(15,122,61,0.08)', borderColor: 'rgba(15,122,61,0.4)' }
                      : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }
                }
              >
                <div className="text-3xl mb-2" style={{ opacity: step.active ? 1 : step.done ? 0.9 : 0.35 }}>
                  {step.icon}
                </div>
                <div
                  className="font-black text-sm"
                  style={{ color: step.active ? '#fff' : step.done ? '#0F7A3D' : '#9ca3af' }}
                >
                  {step.label}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: step.active ? '#F59E0B' : step.done ? '#6b7280' : '#d1d5db' }}
                >
                  {step.sub}
                </div>
                <div
                  className="mt-3 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={
                    step.active
                      ? { backgroundColor: '#F59E0B', color: '#0D1B2A' }
                      : step.done
                        ? { backgroundColor: '#0F7A3D', color: '#fff' }
                        : { backgroundColor: '#e5e7eb', color: '#9ca3af' }
                  }
                >
                  {step.active ? '● ACTIVE' : step.done ? '✓ DONE' : 'PENDING'}
                </div>
              </div>

              {idx < flowSteps.length - 1 && (
                <div
                  className="text-2xl font-black sm:mx-1"
                  style={{ color: step.done || step.active ? '#0F7A3D' : '#d1d5db' }}
                >
                  <span className="hidden sm:block">›</span>
                  <span className="sm:hidden">↓</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Alerts Section ───────────────────────────────────────────────────────────

function AlertsSection() {
  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black" style={{ color: '#0D1B2A' }}>System Alerts</h2>
          <p className="text-gray-500 text-sm mt-0.5">5 alerts in the last 6 hours — 2 require immediate action</p>
        </div>
        <button
          className="text-xs font-semibold text-white px-4 py-2 rounded-lg transition-colors"
          style={{ backgroundColor: '#0F7A3D' }}
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map(alert => {
          const cfg = severityConfig[alert.severity];
          return (
            <div key={alert.id} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow">
              {/* Severity bar */}
              <div className={`w-1 rounded-full flex-shrink-0 ${cfg.bar}`}></div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                    {alert.severity}
                  </span>
                  <span className="font-bold text-sm" style={{ color: '#0D1B2A' }}>{alert.type}</span>
                  <span className="text-gray-400 text-xs ml-auto">{alert.time}</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{alert.desc}</p>
              </div>

              <div className="flex flex-col items-end justify-between flex-shrink-0">
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: '#0D1B2A', color: '#F59E0B' }}
                >
                  {alert.truck}
                </span>
                <button className="text-xs font-semibold mt-2 hover:underline" style={{ color: '#0F7A3D' }}>
                  Resolve →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Logs Section ─────────────────────────────────────────────────────────────

function LogsSection() {
  const statusCell = (s) => ({
    'Delivered':  'bg-green-100 text-green-800',
    'In Transit': 'bg-yellow-100 text-yellow-800',
    'Alert':      'bg-red-100 text-red-800',
  }[s] || 'bg-gray-100 text-gray-700');

  return (
    <section className="bg-white border-t border-gray-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black" style={{ color: '#0D1B2A' }}>Recent Activity Logs</h2>
            <p className="text-gray-500 text-sm mt-0.5">All recorded movements — 18 Apr 2026</p>
          </div>
          <button className="text-xs font-semibold border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors" style={{ color: '#0D1B2A' }}>
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#0D1B2A' }}>
                {['Truck ID', 'Route', 'Departure Zone', 'Destination', 'Expected Vol.', 'Delivered Vol.', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr
                  key={log.truck}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa' }}
                >
                  <td className="px-4 py-3 font-mono font-bold text-xs" style={{ color: '#0D1B2A' }}>{log.truck}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">{log.route}</td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{log.from}</td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{log.to}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">{log.expected}</td>
                  <td
                    className="px-4 py-3 text-xs font-mono font-semibold"
                    style={{ color: log.delivered === '—' ? '#9ca3af' : '#0F7A3D' }}
                  >
                    {log.delivered}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusCell(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-6 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#0D1B2A' }}>
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/pmcs-logo.png" alt="PMCS Logo" className="h-8 w-8 object-contain opacity-80" />
          <div>
            <div className="text-white font-bold text-sm">PMCS — Petroleum Movement &amp; Logistics Control System</div>
            <div className="text-gray-500 text-xs">For Regulatory Use Only — Authorized Personnel</div>
          </div>
        </div>
        <div className="text-center sm:text-right">
          <div className="font-bold text-sm" style={{ color: '#F59E0B' }}>Powered by ASA</div>
          <div className="text-gray-600 text-xs mt-0.5">© {new Date().getFullYear()} All Rights Reserved — PMCS System</div>
        </div>
      </div>
    </footer>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F8' }}>
      <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />
      <HeroSection />
      <TrackingSection />
      <FlowSection />
      <AlertsSection />
      <LogsSection />
      <Footer />
    </div>
  );
}
