import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllInquiriesQuery } from "../../../../api/SalesAPI";
import { CURRENCY_SIGN, formatDate } from "../../../../helper/Utility";

const STATUS_OPTIONS = [
  { value: "new",         label: "New",          cls: "rb-rd"         },
  { value: "reviewing",   label: "Reviewing",    cls: "rb-sourcing"   },
  { value: "quoted",      label: "Quoted",       cls: "rb-sales"      },
  { value: "negotiating", label: "Negotiating",  cls: "rb-costing"    },
  { value: "accepted",    label: "Accepted",     cls: "rb-qc"         },
  { value: "rejected",    label: "Rejected",     cls: "rb-vendor"     },
  { value: "on_hold",     label: "On Hold",      cls: "rb-production" },
];

const SOURCE_LABELS = {
  phone:     "Phone",
  email:     "Email",
  whatsapp:  "WhatsApp",
  walk_in:   "Walk-in",
  reference: "Reference",
};

const statusBadge = (status) => {
  const found = STATUS_OPTIONS.find((s) => s.value === status);
  return <span className={`role-badge ${found?.cls || "rb-vendor"}`}>{found?.label || status}</span>;
};

const Inquiries = () => {
  const navigate = useNavigate();
  const [page,       setPage]       = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const limit = 10;

  const { data, isLoading } = useGetAllInquiriesQuery({ status: filterStatus, page, limit });

  const inquiries  = data?.data         || [];
  const totalPages = data?.totalPages   || 1;
  const totalRecs  = data?.totalRecords ?? 0;

  return (
    <div className="page-wrapper">

      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">Inquiries</div>
          <div className="pg-sub">Track all client inquiries from first contact to confirmed order.</div>
        </div>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => navigate("/inquiry-form")}>＋ New Inquiry</button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            All Inquiries
            <span style={{ fontSize: 12, color: "var(--g500)", fontWeight: 400, marginLeft: 8 }}>({totalRecs} total)</span>
          </div>
          <div className="table-filters">
            <select className="filter-select" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Inquiry ID</th>
              <th>Client</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Target Price</th>
              <th>Source</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={11} style={{ textAlign: "center", padding: 30, color: "var(--g500)" }}>Loading...</td></tr>
            ) : inquiries.length === 0 ? (
              <tr><td colSpan={11} style={{ textAlign: "center", padding: 30, color: "var(--g500)" }}>No inquiries found.</td></tr>
            ) : inquiries.map((inq, idx) => (
              <tr key={inq.id}>
                <td style={{ color: "var(--g500)", fontSize: 11 }}>{(page - 1) * limit + idx + 1}</td>
                <td>
                  <div style={{ fontWeight: 600, color: "var(--red)", fontSize: 12.5 }}>{inq.inquiry_code}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{inq.client_name}</div>
                  {inq.client_phone && <div className="td-meta">{inq.client_phone}</div>}
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{inq.product_desc}</div>
                  {inq.category && <div className="td-meta">{inq.category}</div>}
                </td>
                <td style={{ fontWeight: 500 }}>{inq.quantity} pcs</td>
                <td style={{ fontWeight: 500, color: "var(--g700)" }}>
                  {inq.target_price ? `${CURRENCY_SIGN}${Number(inq.target_price).toLocaleString("en-IN")}` : "—"}
                </td>
                <td style={{ fontSize: 12, color: "var(--g500)" }}>
                  {SOURCE_LABELS[inq.source] || inq.source || "—"}
                </td>
                <td style={{ fontSize: 12, color: "var(--g500)" }}>{inq.assigned_to_name || "—"}</td>
                <td>{statusBadge(inq.status)}</td>
                <td style={{ fontSize: 11.5, color: "var(--g500)" }}>{formatDate(inq.created_at)}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn-sm" onClick={() => navigate(`/inquiry-form?id=${inq.id}`)}>Edit</button>
                    <button className="btn-sm" onClick={() => navigate(`/inquiry-detail/${inq.id}`)}>View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pagination">
          <div className="page-info">Showing {inquiries.length} of {totalRecs} inquiries</div>
          <div className="page-btns">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inquiries;