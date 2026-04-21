import React, { useState, useEffect } from 'react'

const stats = [
  { label: 'Total Revenue',    value: '₹18.4L', change: '+12.3%', icon: 'bi-currency-rupee', positive: true  },
  { label: 'Orders Today',     value: '84',     change: '+5.1%',  icon: 'bi-bag-check-fill', positive: true  },
  { label: 'Active Products',  value: '1,240',  change: '+2.4%',  icon: 'bi-gem',            positive: true  },
  { label: 'Pending Dispatch', value: '23',     change: '-3.2%',  icon: 'bi-truck',          positive: false },
]

const orders = [
  { id: '#JW-1021', customer: 'Sunita Agarwal',   item: 'Gold Necklace Set',   amount: '₹42,500', status: 'Delivered',   badge: 'success' },
  { id: '#JW-1022', customer: 'Meena Sharma',     item: 'Diamond Earrings',    amount: '₹18,200', status: 'Processing',  badge: 'warning' },
  { id: '#JW-1023', customer: 'Rekha Gupta',      item: 'Silver Anklet',       amount: '₹3,800',  status: 'Shipped',     badge: 'info'    },
  { id: '#JW-1024', customer: 'Priya Verma',      item: 'Kundan Bangles Set',  amount: '₹9,600',  status: 'Delivered',   badge: 'success' },
  { id: '#JW-1025', customer: 'Kavita Joshi',     item: 'Polki Maang Tikka',   amount: '₹27,000', status: 'Cancelled',   badge: 'danger'  },
]

const badgeStyle = {
  success:  { background: '#e8f7ee', color: '#1a7a40', border: '1px solid #b6dfca' },
  warning:  { background: '#fff8e6', color: '#8a6200', border: '1px solid #f0d080' },
  info:     { background: '#e8f0fb', color: '#1a4d8a', border: '1px solid #bad0f0' },
  danger:   { background: '#fdecea', color: '#9a1c1c', border: '1px solid #f0b8b8' },
}

const Dashboard = () => {
  return (
    <div style={{ 
      padding: '20px',
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Page Heading */}
   

<div className="content">
  {/* PAGE HEADER */}
  <div className="pg-header">
    <div>
      <div className="pg-title">Sales Dashboard</div>
      <div className="pg-sub">Monitor inquiries, BOM progress, quotes, deposits, and sales handoffs from one place.</div>
    </div>
    <div className="btn-row">
      <button className="btn btn-outline">Create Quote</button>
      <button className="btn btn-primary" onclick="openDrawer()">＋ New Inquiry</button>
    </div>
  </div>
  {/* KPI CARDS */}
  <div className="kpi-grid mb20">
    <div className="kpi-card dark">
      <div className="kpi-label">Pipeline Value</div>
      <div className="kpi-val">₹42.8L</div>
      <div className="kpi-note up">▲ 18.2% vs last month</div>
      <div className="kpi-bar"><div className="kpi-bar-fill" style={{width: '78%'}} /></div>
    </div>
    <div className="kpi-card">
      <div className="kpi-label">Active Inquiries</div>
      <div className="kpi-val">18</div>
      <div className="kpi-note">5 need action today</div>
      <div className="kpi-bar"><div className="kpi-bar-fill" style={{width: '60%'}} /></div>
    </div>
    <div className="kpi-card">
      <div className="kpi-label">Pending BOMs</div>
      <div className="kpi-val" style={{color: 'var(--red)'}}>7</div>
      <div className="kpi-note dn">2 past due date</div>
      <div className="kpi-bar"><div className="kpi-bar-fill" style={{width: '40%', background: 'var(--red)'}} /></div>
    </div>
    <div className="kpi-card">
      <div className="kpi-label">Open Quotes</div>
      <div className="kpi-val">12</div>
      <div className="kpi-note">4 awaiting response</div>
      <div className="kpi-bar"><div className="kpi-bar-fill" style={{width: '55%'}} /></div>
    </div>
    <div className="kpi-card">
      <div className="kpi-label">Accepted This Month</div>
      <div className="kpi-val" style={{color: 'var(--green)'}}>9</div>
      <div className="kpi-note up">▲ 3 more vs last month</div>
      <div className="kpi-bar"><div className="kpi-bar-fill" style={{width: '70%', background: 'var(--green)'}} /></div>
    </div>
    <div className="kpi-card">
      <div className="kpi-label">Pending Deposits</div>
      <div className="kpi-val" style={{color: 'var(--amber)'}}>4</div>
      <div className="kpi-note" style={{color: 'var(--amber)'}}>1 overdue — follow up</div>
      <div className="kpi-bar"><div className="kpi-bar-fill" style={{width: '30%', background: 'var(--amber)'}} /></div>
    </div>
  </div>
  {/* PIPELINE SNAPSHOT */}
  <div className="card mb16">
    <div className="card-pad" style={{paddingBottom: 0}}>
      <div className="card-header" style={{marginBottom: 14}}>
        <div><div className="card-title">Sales Pipeline Snapshot</div><div className="card-sub">Real-time view of all active sales items across the workflow</div></div>
        <span className="card-action">View Full Pipeline →</span>
      </div>
    </div>
    <div className="pipeline-grid">
      <div className="pipe-stage">
        <div className="pipe-accent active" />
        <div className="ps-count" style={{color: 'var(--red)'}}>18</div>
        <div className="ps-name">Inquiry Received</div>
        <div className="ps-tag">Needs action</div>
      </div>
      <div className="pipe-stage">
        <div className="pipe-accent" />
        <div className="ps-count">11</div>
        <div className="ps-name">Style Selected</div>
        <div className="ps-tag">In review</div>
      </div>
      <div className="pipe-stage">
        <div className="pipe-accent warn" />
        <div className="ps-count" style={{color: '#8a5c00'}}>7</div>
        <div className="ps-name">BOM in Progress</div>
        <div className="ps-tag">2 delayed</div>
      </div>
      <div className="pipe-stage">
        <div className="pipe-accent" />
        <div className="ps-count">5</div>
        <div className="ps-name">Estimate Ready</div>
        <div className="ps-tag">Pending quote</div>
      </div>
      <div className="pipe-stage">
        <div className="pipe-accent" />
        <div className="ps-count">12</div>
        <div className="ps-name">Quote Sent</div>
        <div className="ps-tag">4 awaiting reply</div>
      </div>
      <div className="pipe-stage">
        <div className="pipe-accent warn" />
        <div className="ps-count" style={{color: '#8a5c00'}}>3</div>
        <div className="ps-name">Negotiation</div>
        <div className="ps-tag">Target price pending</div>
      </div>
      <div className="pipe-stage">
        <div className="pipe-accent good" />
        <div className="ps-count" style={{color: 'var(--green)'}}>9</div>
        <div className="ps-name">Accepted</div>
        <div className="ps-tag">This month</div>
      </div>
      <div className="pipe-stage">
        <div className="pipe-accent warn" />
        <div className="ps-count">4</div>
        <div className="ps-name">Proforma Pending</div>
        <div className="ps-tag">Awaiting signature</div>
      </div>
      <div className="pipe-stage">
        <div className="pipe-accent warn" />
        <div className="ps-count" style={{color: '#8a5c00'}}>4</div>
        <div className="ps-name">Deposit Pending</div>
        <div className="ps-tag">1 overdue</div>
      </div>
      <div className="pipe-stage">
        <div className="pipe-accent good" />
        <div className="ps-count" style={{color: 'var(--green)'}}>6</div>
        <div className="ps-name">Confirmed for Production</div>
        <div className="ps-tag">Handoff done</div>
      </div>
    </div>
  </div>
  {/* RECENT INQUIRIES TABLE */}
  <div className="card mb16">
    <div className="card-pad" style={{paddingBottom: 0}}>
      <div className="card-header">
        <div>
          <div className="card-title">Recent Inquiries</div>
          <div className="card-sub">Latest client requests requiring sales action</div>
        </div>
        <span className="card-action">View All Inquiries →</span>
      </div>
    </div>
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Inquiry ID</th>
            <th>Client</th>
            <th>Requested Product</th>
            <th>Qty</th>
            <th>Target Price</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><div className="td-id">INQ-2026-031</div></td>
            <td><div className="td-main">Rajesh Jewellers</div><div className="td-meta">Mumbai · Regular client</div></td>
            <td><div className="td-main">Diamond Bracelet Set</div><div className="td-meta">Category: Diamond · 18K White Gold</div></td>
            <td>25 pcs</td>
            <td className="td-amount">₹66,000/pc</td>
            <td><div className="td-meta">Anika Mehta</div></td>
            <td><span className="pill p-new"><span className="pdot" />New</span></td>
            <td><div style={{display: 'flex', gap: 6, justifyContent: 'flex-end'}}><button className="btn-sm">View</button><button className="btn-sm red">Start BOM</button></div></td>
          </tr>
          <tr>
            <td><div className="td-id">INQ-2026-030</div></td>
            <td><div className="td-main">Meena Crafts</div><div className="td-meta">Delhi · Since 2021</div></td>
            <td><div className="td-main">Gold Necklace Set</div><div className="td-meta">Category: Gold · 22K</div></td>
            <td>50 pcs</td>
            <td className="td-amount">₹45,000/pc</td>
            <td><div className="td-meta">Anika Mehta</div></td>
            <td><span className="pill p-bom"><span className="pdot" />Awaiting BOM</span></td>
            <td><div style={{display: 'flex', gap: 6, justifyContent: 'flex-end'}}><button className="btn-sm">View</button><button className="btn-sm red">Start BOM</button></div></td>
          </tr>
          <tr>
            <td><div className="td-id">INQ-2026-029</div></td>
            <td><div className="td-main">Priya Gold House</div><div className="td-meta">Jaipur · New client</div></td>
            <td><div className="td-main">Kundan Ring Set</div><div className="td-meta">Category: Kundan · Meenakari</div></td>
            <td>10 pcs</td>
            <td className="td-amount">₹38,000/pc</td>
            <td><div className="td-meta">Ravi Kumar</div></td>
            <td><span className="pill p-match"><span className="pdot" />Style Match Found</span></td>
            <td><div style={{display: 'flex', gap: 6, justifyContent: 'flex-end'}}><button className="btn-sm">View</button><button className="btn-sm red">Create Quote</button></div></td>
          </tr>
          <tr>
            <td><div className="td-id">INQ-2026-028</div></td>
            <td><div className="td-main">Sunita Agarwal</div><div className="td-meta">Surat · Via WhatsApp</div></td>
            <td><div className="td-main">Polki Maang Tikka</div><div className="td-meta">Category: Polki · Bridal Set</div></td>
            <td>5 pcs</td>
            <td className="td-amount">₹27,000/pc</td>
            <td><div className="td-meta">Anika Mehta</div></td>
            <td><span className="pill p-review"><span className="pdot" />Reviewing</span></td>
            <td><div style={{display: 'flex', gap: 6, justifyContent: 'flex-end'}}><button className="btn-sm">View</button></div></td>
          </tr>
          <tr>
            <td><div className="td-id">INQ-2026-027</div></td>
            <td><div className="td-main">Anita Jewels</div><div className="td-meta">Ahmedabad · Regular</div></td>
            <td><div className="td-main">Silver Anklet Set</div><div className="td-meta">Category: Silver · 925</div></td>
            <td>30 pcs</td>
            <td className="td-amount">₹3,800/pc</td>
            <td><div className="td-meta">Ravi Kumar</div></td>
            <td><span className="pill p-ready"><span className="pdot" />Ready for Quote</span></td>
            <td><div style={{display: 'flex', gap: 6, justifyContent: 'flex-end'}}><button className="btn-sm red">Create Quote</button></div></td>
          </tr>
          <tr>
            <td><div className="td-id">INQ-2026-026</div></td>
            <td><div className="td-main">Kavita Joshi</div><div className="td-meta">Kolkata · Via email</div></td>
            <td><div className="td-main">Bridal Earrings Set</div><div className="td-meta">Category: Kundan · Heavy bridal</div></td>
            <td>8 pcs</td>
            <td className="td-amount">₹52,000/pc</td>
            <td><div className="td-meta">Anika Mehta</div></td>
            <td><span className="pill p-new"><span className="pdot" />New</span></td>
            <td><div style={{display: 'flex', gap: 6, justifyContent: 'flex-end'}}><button className="btn-sm">View</button><button className="btn-sm red">Start BOM</button></div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  {/* BOM WORKQUEUE + QUOTE FOLLOW-UPS */}
  <div className="two-col">
    {/* BOM WORKQUEUE */}
    <div className="card card-pad">
      <div className="card-header">
        <div><div className="card-title">BOM Workqueue</div><div className="card-sub">Pending BOM tasks requiring your attention</div></div>
        <span className="card-action">View All →</span>
      </div>
      <div className="wq-item">
        <div>
          <div className="wq-id">BOM-2026-113</div>
          <div className="wq-name">Diamond Bracelet · STY-009 v2</div>
          <div className="wq-client">Rajesh Jewellers</div>
          <div className="wq-due urgent">Due: Today — Awaiting component confirmation</div>
        </div>
        <button className="btn-sm red">Edit BOM</button>
      </div>
      <div className="wq-item">
        <div>
          <div className="wq-id">BOM-2026-112</div>
          <div className="wq-name">Gold Necklace Set · STY-001 v3</div>
          <div className="wq-client">Meena Crafts</div>
          <div className="wq-due urgent">Due: 09 Apr — Needs revision</div>
        </div>
        <button className="btn-sm red">Revise</button>
      </div>
      <div className="wq-item">
        <div>
          <div className="wq-id">BOM-2026-111</div>
          <div className="wq-name">Kundan Ring · STY-004 v1</div>
          <div className="wq-client">Priya Gold House</div>
          <div className="wq-due">Due: 11 Apr — Ready for costing</div>
        </div>
        <button className="btn-sm">Send to Costing</button>
      </div>
      <div className="wq-item">
        <div>
          <div className="wq-id">BOM-2026-110</div>
          <div className="wq-name">Polki Maang Tikka · STY-008 v1</div>
          <div className="wq-client">Sunita Agarwal</div>
          <div className="wq-due">Due: 12 Apr — Pending style mapping</div>
        </div>
        <button className="btn-sm">Map Style</button>
      </div>
      <div className="wq-item">
        <div>
          <div className="wq-id">BOM-2026-109</div>
          <div className="wq-name">Bridal Earrings · STY-021 v1</div>
          <div className="wq-client">Kavita Joshi</div>
          <div className="wq-due">Due: 14 Apr — Draft started</div>
        </div>
        <button className="btn-sm">Continue</button>
      </div>
    </div>
    {/* QUOTE FOLLOW-UPS */}
    <div className="card card-pad">
      <div className="card-header">
        <div><div className="card-title">Quote Follow-ups</div><div className="card-sub">Quotes requiring action or follow-up</div></div>
        <span className="card-action">View All →</span>
      </div>
      <div className="wq-item">
        <div>
          <div className="wq-id">QT-2026-041</div>
          <div className="wq-name">Rajesh Jewellers · ₹16,50,000</div>
          <div className="wq-client">Diamond Bracelet Set × 25</div>
          <div className="wq-due urgent">Follow-up: Today — Awaiting response (3 days)</div>
        </div>
        <button className="btn-sm red">Follow Up</button>
      </div>
      <div className="wq-item">
        <div>
          <div className="wq-id">QT-2026-040</div>
          <div className="wq-name">Priya Gold House · ₹3,80,000</div>
          <div className="wq-client">Kundan Ring × 10 · v2</div>
          <div className="wq-due urgent">Negotiation — Client requested target ₹35,000</div>
        </div>
        <button className="btn-sm red">Revise Quote</button>
      </div>
      <div className="wq-item">
        <div>
          <div className="wq-id">QT-2026-039</div>
          <div className="wq-name">Anita Jewels · ₹1,14,000</div>
          <div className="wq-client">Silver Anklet × 30</div>
          <div className="wq-due">Follow-up: 10 Apr — Send updated version</div>
        </div>
        <button className="btn-sm">Send Update</button>
      </div>
      <div className="wq-item">
        <div>
          <div className="wq-id">QT-2026-038</div>
          <div className="wq-name">Meena Crafts · ₹3,64,000</div>
          <div className="wq-client">Diamond Earrings × 20</div>
          <div className="wq-due">Follow-up: 12 Apr — Awaiting response</div>
        </div>
        <button className="btn-sm">Nudge Client</button>
      </div>
      <div className="wq-item">
        <div>
          <div className="wq-id">QT-2026-037</div>
          <div className="wq-name">Sunita Agarwal · ₹1,35,000</div>
          <div className="wq-client">Polki Maang Tikka × 5</div>
          <div className="wq-due urgent">Expiring: 13 Apr — Revised pricing requested</div>
        </div>
        <button className="btn-sm red">Revise</button>
      </div>
    </div>
  </div>
  {/* PENDING COMMERCIAL ACTIONS */}
  <div className="card card-pad mb16">
    <div className="card-header">
      <div><div className="card-title">Pending Commercial Actions</div><div className="card-sub">High-priority tasks requiring immediate sales attention</div></div>
      <span className="card-action">View All →</span>
    </div>
    <div className="ca-item">
      <div className="ca-ref">PF-2026-011</div>
      <div className="ca-body">
        <div className="ca-client">Rajesh Jewellers</div>
        <div className="ca-desc">Proforma unsigned for 5 days — signature required to release production</div>
      </div>
      <div className="ca-due red">5 days overdue</div>
      <button className="btn-sm red">Send Reminder</button>
    </div>
    <div className="ca-item">
      <div className="ca-ref">SO-2026-022</div>
      <div className="ca-body">
        <div className="ca-client">Meena Crafts</div>
        <div className="ca-desc">Deposit of ₹1,09,200 overdue by 2 days — blocking production start</div>
      </div>
      <div className="ca-due red">Deposit overdue</div>
      <button className="btn-sm red">Follow Up</button>
    </div>
    <div className="ca-item">
      <div className="ca-ref">QT-2026-041</div>
      <div className="ca-body">
        <div className="ca-client">Rajesh Jewellers</div>
        <div className="ca-desc">Quote expiring in 2 days — no response received. Diamond Bracelet Set × 25</div>
      </div>
      <div className="ca-due amber">Expires Apr 10</div>
      <button className="btn-sm">Extend Quote</button>
    </div>
    <div className="ca-item">
      <div className="ca-ref">QT-2026-040</div>
      <div className="ca-body">
        <div className="ca-client">Priya Gold House</div>
        <div className="ca-desc">Client requested revised pricing at ₹35,000/pc. Revised quote v3 pending from costing</div>
      </div>
      <div className="ca-due amber">Awaiting costing</div>
      <button className="btn-sm">Open Quote</button>
    </div>
    <div className="ca-item">
      <div className="ca-ref">SO-2026-021</div>
      <div className="ca-body">
        <div className="ca-client">Anita Jewels</div>
        <div className="ca-desc">Production handoff awaiting sales confirmation — Tier 1 remarks not yet added</div>
      </div>
      <div className="ca-due amber">Action needed</div>
      <button className="btn-sm red">Confirm Handoff</button>
    </div>
    <div className="ca-item">
      <div className="ca-ref">PF-2026-010</div>
      <div className="ca-body">
        <div className="ca-client">Sunita Agarwal</div>
        <div className="ca-desc">Sales order blocked — deposit of ₹40,500 not yet received. Proforma signed.</div>
      </div>
      <div className="ca-due red">Deposit missing</div>
      <button className="btn-sm">View Proforma</button>
    </div>
  </div>
  {/* TOP CLIENTS + QUICK ACTIONS */}
  <div className="two-col">
    <div className="card card-pad">
      <div className="card-header">
        <div><div className="card-title">Top Clients This Month</div></div>
        <span className="card-action">All Clients →</span>
      </div>
      <div className="client-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
        <div className="client-card">
          <div className="cc-av" style={{background: 'var(--red)'}}>R</div>
          <div className="cc-name">Rajesh Jewellers</div>
          <div className="cc-stat">4 active quotes</div>
          <div className="cc-stat">Last contact: Today</div>
          <div className="cc-val">₹22.5L</div>
          <div className="cc-note">2 accepted this month</div>
        </div>
        <div className="client-card">
          <div className="cc-av" style={{background: '#1a1a3e'}}>M</div>
          <div className="cc-name">Meena Crafts</div>
          <div className="cc-stat">2 active quotes</div>
          <div className="cc-stat">Last contact: Yesterday</div>
          <div className="cc-val">₹8.6L</div>
          <div className="cc-note">1 accepted this month</div>
        </div>
        <div className="client-card">
          <div className="cc-av" style={{background: '#2d4a1e'}}>P</div>
          <div className="cc-name">Priya Gold House</div>
          <div className="cc-stat">1 active quote</div>
          <div className="cc-stat">Last contact: 2 days ago</div>
          <div className="cc-val">₹3.8L</div>
          <div className="cc-note">Negotiating v3</div>
        </div>
        <div className="client-card">
          <div className="cc-av" style={{background: '#4a1e2d'}}>A</div>
          <div className="cc-name">Anita Jewels</div>
          <div className="cc-stat">2 active quotes</div>
          <div className="cc-stat">Last contact: 3 days ago</div>
          <div className="cc-val">₹2.3L</div>
          <div className="cc-note">1 accepted this month</div>
        </div>
      </div>
    </div>
    {/* QUICK ACTIONS */}
    <div className="card card-pad">
      <div className="card-header">
        <div><div className="card-title">Quick Actions</div><div className="card-sub">Frequently used sales shortcuts</div></div>
      </div>
      <div className="qa-grid">
        <div className="qa-tile" onclick="openDrawer()">
          <div className="qa-icon">📋</div>
          <div className="qa-label">Create Inquiry</div>
          <div className="qa-sub">Log client request</div>
        </div>
        <div className="qa-tile">
          <div className="qa-icon">📐</div>
          <div className="qa-label">Add BOM</div>
          <div className="qa-sub">New bill of materials</div>
        </div>
        <div className="qa-tile">
          <div className="qa-icon">📄</div>
          <div className="qa-label">Create Quote</div>
          <div className="qa-sub">From estimate</div>
        </div>
        <div className="qa-tile">
          <div className="qa-icon">📑</div>
          <div className="qa-label">Generate Proforma</div>
          <div className="qa-sub">Client document</div>
        </div>
        <div className="qa-tile">
          <div className="qa-icon">🏦</div>
          <div className="qa-label">Record Deposit</div>
          <div className="qa-sub">Mark as received</div>
        </div>
        <div className="qa-tile">
          <div className="qa-icon">👥</div>
          <div className="qa-label">Open Client</div>
          <div className="qa-sub">View profile</div>
        </div>
        <div className="qa-tile">
          <div className="qa-icon">⚙</div>
          <div className="qa-label">Start Handoff</div>
          <div className="qa-sub">Push to production</div>
        </div>
        <div className="qa-tile">
          <div className="qa-icon">📊</div>
          <div className="qa-label">View Reports</div>
          <div className="qa-sub">Sales analytics</div>
        </div>
      </div>
    </div>
  </div>
  {/* ACTIVITY TIMELINE + ALERTS */}
  <div className="two-col">
    {/* ACTIVITY */}
    <div className="card card-pad">
      <div className="card-header">
        <div><div className="card-title">Recent Activity</div><div className="card-sub">Audit trail of sales actions</div></div>
        <span className="card-action">Full Log →</span>
      </div>
      <div className="timeline">
        <div className="tl-item">
          <div className="tl-dot-col"><div className="tl-dot green" /></div>
          <div className="tl-text"><strong>QT-2026-041</strong> accepted by Rajesh Jewellers — Diamond Bracelet Set × 25</div>
          <div className="tl-time">2h ago</div>
        </div>
        <div className="tl-item">
          <div className="tl-dot-col"><div className="tl-dot blue" /></div>
          <div className="tl-text"><strong>BOM-2026-113</strong> created for STY-004 v2 — Kundan Ring Set</div>
          <div className="tl-time">4h ago</div>
        </div>
        <div className="tl-item">
          <div className="tl-dot-col"><div className="tl-dot green" /></div>
          <div className="tl-text">Deposit ₹1,09,200 received for <strong>SO-2026-022</strong> — Meena Crafts</div>
          <div className="tl-time">Today, 11:40</div>
        </div>
        <div className="tl-item">
          <div className="tl-dot-col"><div className="tl-dot blue" /></div>
          <div className="tl-text">Proforma <strong>PF-2026-011</strong> sent for digital signing — Rajesh Jewellers</div>
          <div className="tl-time">Today, 10:15</div>
        </div>
        <div className="tl-item">
          <div className="tl-dot-col"><div className="tl-dot amber" /></div>
          <div className="tl-text">Revised quote <strong>QT-2026-040 v2</strong> created after target price discussion — Priya Gold House</div>
          <div className="tl-time">Yesterday</div>
        </div>
        <div className="tl-item">
          <div className="tl-dot-col"><div className="tl-dot black" /></div>
          <div className="tl-text">Sales order <strong>SO-2026-021</strong> confirmed and pushed to production handoff queue</div>
          <div className="tl-time">Yesterday</div>
        </div>
        <div className="tl-item">
          <div className="tl-dot-col"><div className="tl-dot red" /></div>
          <div className="tl-text">Prior QC note surfaced for repeat bracelet order — diamond setting issue flagged for production team</div>
          <div className="tl-time">Apr 6</div>
        </div>
        <div className="tl-item">
          <div className="tl-dot-col"><div className="tl-dot green" /></div>
          <div className="tl-text">Estimate <strong>EST-2026-018</strong> approved by Costing for Gold Necklace Set — ready for quote</div>
          <div className="tl-time">Apr 6</div>
        </div>
        <div className="tl-item">
          <div className="tl-dot-col"><div className="tl-dot blue" /></div>
          <div className="tl-text">Client Kavita Joshi uploaded revised design attachment for bridal earrings — INQ-2026-026</div>
          <div className="tl-time">Apr 5</div>
        </div>
        <div className="tl-item">
          <div className="tl-dot-col"><div className="tl-dot black" /></div>
          <div className="tl-text">Production team acknowledged <strong>PIN-2026-008</strong> — Gold Necklace Set production started</div>
          <div className="tl-time">Apr 5</div>
        </div>
      </div>
    </div>
    {/* ALERTS */}
    <div className="card card-pad">
      <div className="card-header">
        <div><div className="card-title">Alerts &amp; Reminders</div><div className="card-sub">Action required or attention needed</div></div>
        <span className="card-action">Manage →</span>
      </div>
      <div className="alert-item">
        <div className="alert-dot" style={{background: 'var(--red)', marginTop: 6, flexShrink: 0}} />
        <div className="ai-body">
          <div className="ai-msg">3 quotes expire within 2 days</div>
          <div className="ai-note">QT-2026-041, QT-2026-039, QT-2026-037 — extend or follow up now</div>
        </div>
        <div className="ai-tag tag-urg">Urgent</div>
      </div>
      <div className="alert-item">
        <div className="alert-dot" style={{background: 'var(--red)', marginTop: 6, flexShrink: 0}} />
        <div className="ai-body">
          <div className="ai-msg">Deposit overdue — SO-2026-022</div>
          <div className="ai-note">Meena Crafts deposit of ₹1,09,200 is 2 days late. Production on hold.</div>
        </div>
        <div className="ai-tag tag-urg">Overdue</div>
      </div>
      <div className="alert-item">
        <div className="alert-dot" style={{background: 'var(--amber)', marginTop: 6, flexShrink: 0}} />
        <div className="ai-body">
          <div className="ai-msg">1 BOM revision delayed beyond SLA</div>
          <div className="ai-note">BOM-2026-112 (Gold Necklace Set) — revision overdue by 1 day</div>
        </div>
        <div className="ai-tag tag-warn">Delayed</div>
      </div>
      <div className="alert-item">
        <div className="alert-dot" style={{background: 'var(--amber)', marginTop: 6, flexShrink: 0}} />
        <div className="ai-body">
          <div className="ai-msg">4 inquiries have no next action assigned</div>
          <div className="ai-note">INQ-2026-031, 028, 026, 025 — unassigned next steps</div>
        </div>
        <div className="ai-tag tag-warn">Attention</div>
      </div>
      <div className="alert-item">
        <div className="alert-dot" style={{background: 'var(--amber)', marginTop: 6, flexShrink: 0}} />
        <div className="ai-body">
          <div className="ai-msg">Proforma unsigned for 5 days — PF-2026-011</div>
          <div className="ai-note">Rajesh Jewellers has not signed. Production cannot begin without signature.</div>
        </div>
        <div className="ai-tag tag-warn">Follow Up</div>
      </div>
      <div className="alert-item">
        <div className="alert-dot" style={{background: 'var(--g300)', marginTop: 6, flexShrink: 0}} />
        <div className="ai-body">
          <div className="ai-msg">2 repeat clients waiting on revised quotes</div>
          <div className="ai-note">Priya Gold House (v3) and Sunita Agarwal (v2) — revised quote pending</div>
        </div>
        <div className="ai-tag tag-info">Pending</div>
      </div>
      <div className="alert-item">
        <div className="alert-dot" style={{background: 'var(--g300)', marginTop: 6, flexShrink: 0}} />
        <div className="ai-body">
          <div className="ai-msg">2 deposits pending confirmation from Accounts</div>
          <div className="ai-note">PF-2026-010 (Sunita Agarwal) and PF-2026-009 (Anita Jewels) awaiting</div>
        </div>
        <div className="ai-tag tag-info">Waiting</div>
      </div>
    </div>
  </div>
</div>

    </div>
  )
}

export default Dashboard