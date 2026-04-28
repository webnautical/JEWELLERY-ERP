import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllQuotesQuery,
  useGetAllClientsQuery,
  useGetAllInquiriesQuery,
} from "../../../../api/SalesAPI";
import { formatDate, CURRENCY_SIGN } from "../../../../helper/Utility";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft", cls: "rb-vendor" },
  { value: "sent", label: "Sent", cls: "rb-sales" },
  { value: "accepted", label: "Accepted", cls: "rb-qc" },
  { value: "rejected", label: "Rejected", cls: "rb-rd" },
  { value: "negotiating", label: "Negotiating", cls: "rb-costing" },
  { value: "expired", label: "Expired", cls: "rb-production" },
];

const fmt = (val) =>
  val != null && val !== ""
    ? `${CURRENCY_SIGN}${Number(val).toLocaleString("en-IN")}`
    : "—";

const statusBadge = (status) => {
  const found = STATUS_OPTIONS.find((s) => s.value === status);
  return (
    <span className={`role-badge ${found?.cls || "rb-vendor"}`}>
      {found?.label || status}
    </span>
  );
};

const isExpired = (validUntil) =>
  validUntil && new Date(validUntil) < new Date();

const Quotes = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [clientId, setClientId] = useState("");
  const [inquiryId, setInquiryId] = useState("");
  const [status, setStatus] = useState([]);
  const limit = 10;

  const { data, isLoading } = useGetAllQuotesQuery({
    status,
    clientId,
    inquiryId,
    search,
    page,
    limit,
  });
  const { data: clientsData } = useGetAllClientsQuery({ limit: 100 });
  const { data: inquiriesData } = useGetAllInquiriesQuery({ limit: 100 });

  const quotes = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalRecs = data?.totalRecords ?? 0;
  const clients = clientsData?.data || [];
  const inquiries = inquiriesData?.data || [];

  const handleStatusToggle = (val) => {
    setStatus((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val],
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setClientId("");
    setInquiryId("");
    setStatus([]);
    setPage(1);
  };

  const hasFilters = search || clientId || inquiryId || status.length > 0;

  return (
    <div className="page-wrapper">
      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">Quotes</div>
          <div className="pg-sub">
            Track all quotes sent to clients — monitor status, validity, and
            follow-ups.
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">
        <div className="table-header" style={{ flexWrap: "wrap", gap: 12 }}>
          <div className="table-title">
            All Quotes
            <span
              style={{
                fontSize: 12,
                color: "var(--g500)",
                fontWeight: 400,
                marginLeft: 8,
              }}
            >
              ({totalRecs} total)
            </span>
          </div>
          <div className="table-filters" style={{ flexWrap: "wrap", gap: 8 }}>
            <input
              className="filter-inp"
              placeholder="Search client, style..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <select
              className="filter-select"
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Clients</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.client_name}
                </option>
              ))}
            </select>
            <select
              className="filter-select"
              value={inquiryId}
              onChange={(e) => {
                setInquiryId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Inquiries</option>
              {inquiries.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.inquiry_code} — {i.client_name}
                </option>
              ))}
            </select>
            {hasFilters && (
              <button
                className="btn btn-outline"
                style={{ padding: "6px 12px", fontSize: 11.5 }}
                onClick={clearFilters}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Status filter pills */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "10px 16px",
            borderBottom: "1px solid var(--g200)",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "var(--g500)",
              alignSelf: "center",
              marginRight: 4,
            }}
          >
            Status:
          </span>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => handleStatusToggle(s.value)}
              style={{
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                border: status.includes(s.value)
                  ? "none"
                  : "1px solid var(--g200)",
                background: status.includes(s.value) ? "var(--black)" : "#fff",
                color: status.includes(s.value) ? "#fff" : "var(--g700)",
                transition: "all .15s",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Quote</th>
              <th>Inquiry</th>
              <th>Client</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Quote / pc</th>
              <th>Total Value</th>
              <th>Valid Until</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={12}
                  style={{
                    textAlign: "center",
                    padding: 30,
                    color: "var(--g500)",
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : quotes.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  style={{
                    textAlign: "center",
                    padding: 30,
                    color: "var(--g500)",
                  }}
                >
                  No quotes found.
                </td>
              </tr>
            ) : (
              quotes.map((q, idx) => {
                const expired = isExpired(q.valid_until);
                return (
                  <tr
                    key={q.id}
                    style={{
                      opacity: expired && q.status !== "accepted" ? 0.65 : 1,
                    }}
                  >
                    <td style={{ color: "var(--g500)", fontSize: 11 }}>
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "var(--red)",
                          fontSize: 12.5,
                        }}
                      >
                        {q.quote_code}
                      </div>
                      <div className="td-meta">v{q.version}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 12 }}>
                        {q.inquiry_code}
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{q.client_name}</td>
                    <td>
                      <div style={{ fontSize: 12.5 }}>{q.product_desc}</div>
                      <div className="td-meta">{q.style_code}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{q.quantity} pcs</td>
                    <td style={{ fontWeight: 600 }}>
                      {fmt(q.quote_per_piece)}
                    </td>
                    <td style={{ fontWeight: 700 }}>{fmt(q.total_value)}</td>
                    <td>
                      <div
                        style={{
                          fontSize: 12,
                          color: expired ? "var(--red)" : "var(--g700)",
                          fontWeight: expired ? 600 : 400,
                        }}
                      >
                        {q.valid_until ? formatDate(q.valid_until) : "—"}
                      </div>
                      {expired && q.status !== "accepted" && (
                        <div style={{ fontSize: 10, color: "var(--red)" }}>
                          Expired
                        </div>
                      )}
                    </td>
                    <td>{statusBadge(q.status)}</td>
                    <td style={{ fontSize: 11.5, color: "var(--g500)" }}>
                      {formatDate(q.created_at)}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn-sm"
                          onClick={() => navigate(`/quote-pdf/${q.id}`)}
                        >
                          🖨 Print
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pagination">
          <div className="page-info">
            Showing {quotes.length} of {totalRecs} quotes
          </div>
          <div className="page-btns">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`page-btn ${p === page ? "active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotes;
