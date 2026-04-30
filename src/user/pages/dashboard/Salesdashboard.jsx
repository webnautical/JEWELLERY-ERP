import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetSalesDashboardQuery } from "../../../api/SalesAPI";
import { formatDate, CURRENCY_SIGN } from "../../../helper/Utility";

// ── Helpers ───────────────────────────────────────────────────────────────
const fmt = (val) =>
  val != null && val !== ""
    ? `${CURRENCY_SIGN}${Number(val).toLocaleString("en-IN")}`
    : "—";

const isExpired = (date) => date && new Date(date) < new Date();

const PIPELINE_STAGES = [
  { label: "New Inquiries", key: "new_inquiries", accent: "active" },
  { label: "BOM In Progress", key: "bom_in_progress", accent: "warn" },
  { label: "Est. Pending", key: "estimate_pending", accent: "warn" },
  { label: "Est. Ready", key: "estimate_ready", accent: "" },
  { label: "Quoted", key: "quoted", accent: "" },
  { label: "Negotiating", key: "negotiating", accent: "warn" },
  { label: "Accepted", key: "accepted", accent: "good" },
  { label: "Lost", key: "lost", accent: "" },
];

const QUOTE_STATUS_BADGE = {
  draft: "rb-vendor",
  sent: "rb-sales",
  accepted: "rb-qc",
  rejected: "rb-rd",
  negotiating: "rb-costing",
  expired: "rb-production",
};

const INQ_STATUS_BADGE = {
  new: "rb-rd",
  reviewing: "rb-sourcing",
  quoted: "rb-sales",
  negotiating: "rb-costing",
  accepted: "rb-qc",
  rejected: "rb-vendor",
  estimate_ready: "rb-qc",
  bom_in_progress: "rb-production",
  lost: "rb-vendor",
};

// ── Avatar color by index ─────────────────────────────────────────────────
const AVATAR_COLORS = [
  "#d12026",
  "#1a1a3e",
  "#2d4a1e",
  "#4a1e2d",
  "#1a4d8a",
  "#7c3aed",
];

const SalesDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetSalesDashboardQuery();
  const d = data?.data;

  if (isLoading) {
    return (
      <div className="content">
        <div className="dash-loading">Loading dashboard...</div>
      </div>
    );
  }

  if (!d) return null;

  const { overview, pipeline, quotes, topClients, recentActivity, alerts } = d;

  const sentQuotes =
    quotes.byStatus.find((s) => s.status === "sent")?.count || 0;
  const draftQuotes =
    quotes.byStatus.find((s) => s.status === "draft")?.count || 0;

  const totalPipeline =
    PIPELINE_STAGES.reduce(
      (sum, s) => sum + parseInt(pipeline[s.key] || 0),
      0,
    ) || 1;

  return (
    <div className="page-wrapper">
      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">Sales Dashboard</div>
          <div className="pg-sub">
            Monitor inquiries, BOM progress, quotes, and sales pipeline from one
            place.
          </div>
        </div>
        <div className="btn-row">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/quotes")}
          >
            View Quotes
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/inquiry-form")}
          >
            ＋ New Inquiry
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-grid mb20">
        <div className="kpi-card dark">
          <div className="kpi-label">Pipeline Value</div>
          <div className="kpi-val">{fmt(quotes.pipelineValue)}</div>
          <div className="kpi-note up">
            Accepted: {fmt(quotes.acceptedThisMonth)}
          </div>
          <div className="kpi-bar">
            <div
              className="kpi-bar-fill"
              style={{ width: "80%", background: "var(--green)" }}
            />
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Inquiries</div>
          <div className="kpi-val">{overview.totalInquiries}</div>
          <div className="kpi-note">{overview.thisMonth} this month</div>
          <div className="kpi-bar">
            <div className="kpi-bar-fill" style={{ width: "65%" }} />
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Pending BOMs</div>
          <div
            className="kpi-val"
            style={{
              color: overview.pendingBOMs > 0 ? "var(--amber)" : "var(--green)",
            }}
          >
            {overview.pendingBOMs}
          </div>
          <div
            className="kpi-note"
            style={{
              color: overview.pendingBOMs > 0 ? "var(--amber)" : "var(--g500)",
            }}
          >
            {overview.pendingBOMs > 0 ? "Action required" : "All clear"}
          </div>
          <div className="kpi-bar">
            <div
              className="kpi-bar-fill"
              style={{
                width: `${Math.min(overview.pendingBOMs * 15, 100)}%`,
                background: "var(--amber)",
              }}
            />
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Quotes Sent</div>
          <div className="kpi-val">{sentQuotes}</div>
          <div className="kpi-note">{draftQuotes} in draft</div>
          <div className="kpi-bar">
            <div className="kpi-bar-fill" style={{ width: "55%" }} />
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Ready Estimates</div>
          <div
            className="kpi-val"
            style={{
              color:
                overview.readyEstimates > 0 ? "var(--green)" : "var(--g500)",
            }}
          >
            {overview.readyEstimates}
          </div>
          <div className="kpi-note">Ready to quote</div>
          <div className="kpi-bar">
            <div
              className="kpi-bar-fill"
              style={{
                width: `${Math.min(overview.readyEstimates * 20, 100)}%`,
                background: "var(--green)",
              }}
            />
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Clients</div>
          <div className="kpi-val" style={{ color: "var(--green)" }}>
            {overview.totalClients}
          </div>
          <div className="kpi-note up">
            +{overview.newClientsThisMonth} this month
          </div>
          <div className="kpi-bar">
            <div
              className="kpi-bar-fill"
              style={{ width: "50%", background: "var(--green)" }}
            />
          </div>
        </div>
      </div>

      {/* PIPELINE SNAPSHOT */}
      <div className="card mb16">
        <div className="card-pad" style={{ paddingBottom: 0 }}>
          <div className="card-header" style={{ marginBottom: 14 }}>
            <div>
              <div className="card-title">Sales Pipeline Snapshot</div>
              <div className="card-sub">
                Real-time view of all active sales items across the workflow
              </div>
            </div>
            <span
              className="card-action"
              onClick={() => navigate("/inquiries")}
            >
              View All Inquiries →
            </span>
          </div>
        </div>
        <div className="pipeline-grid">
          {PIPELINE_STAGES.map((stage) => {
            const count = parseInt(pipeline[stage.key] || 0);
            return (
              <div key={stage.key} className="pipe-stage">
                <div className={`pipe-accent ${stage.accent}`} />
                <div
                  className="ps-count"
                  style={{
                    color:
                      stage.accent === "good"
                        ? "var(--green)"
                        : stage.accent === "active"
                          ? "var(--red)"
                          : stage.accent === "warn"
                            ? "#8a5c00"
                            : "inherit",
                  }}
                >
                  {count}
                </div>
                <div className="ps-name">{stage.label}</div>
                <div className="ps-tag">
                  {count === 0 ? "None" : `${count} active`}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ height: 14 }} />
      </div>

      {/* TWO COL — Recent Inquiries + Alerts */}
      <div className="two-col mb16">
        {/* RECENT INQUIRIES */}
        <div className="card card-pad">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Inquiries</div>
              <div className="card-sub">
                Latest client requests requiring action
              </div>
            </div>
            <span
              className="card-action"
              onClick={() => navigate("/inquiries")}
            >
              View All →
            </span>
          </div>
          <table className="erp-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Client</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="dash-empty-cell">
                    No recent inquiries.
                  </td>
                </tr>
              ) : (
                recentActivity.inquiries.map((inq) => (
                  <tr key={inq.id}>
                    <td>
                      <span className="td-id">{inq.inquiry_code}</span>
                    </td>
                    <td className="td-main">{inq.client_name}</td>
                    <td>
                      <div className="td-main">{inq.product_desc}</div>
                      {inq.style_name && (
                        <div className="td-meta">{inq.style_name}</div>
                      )}
                    </td>
                    <td className="td-meta">{inq.quantity} pcs</td>
                    <td>
                      <span
                        className={`role-badge ${INQ_STATUS_BADGE[inq.status] || "rb-vendor"}`}
                      >
                        {inq.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="td-meta">{formatDate(inq.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ALERTS */}
        <div className="card card-pad">
          <div className="card-header">
            <div>
              <div className="card-title">Alerts &amp; Reminders</div>
              <div className="card-sub">
                Action required or attention needed
              </div>
            </div>
          </div>

          {/* Expiring quotes */}
          {alerts.expiringQuotes?.length > 0 ? (
            <>
              <div className="alert-item">
                <div
                  className="alert-dot"
                  style={{
                    background: "var(--red)",
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
                <div className="ai-body">
                  <div className="ai-msg">
                    {alerts.expiringQuotes.length} Quotes Expiring Soon
                  </div>
                  <div className="ai-note">
                    Follow up before validity lapses.
                  </div>
                </div>
                <div className="ai-tag tag-urg">Urgent</div>
              </div>
              {alerts.expiringQuotes.map((q) => (
                <div key={q.id} className="alert-item">
                  <div
                    className="alert-dot"
                    style={{
                      background: isExpired(q.valid_until)
                        ? "var(--red)"
                        : "var(--amber)",
                      marginTop: 6,
                      flexShrink: 0,
                    }}
                  />
                  <div className="ai-body">
                    <div className="ai-msg">
                      {q.quote_code} — {q.client_name}
                    </div>
                    <div className="ai-note">
                      {q.style_name} · {fmt(q.total_value)} ·{" "}
                      {isExpired(q.valid_until)
                        ? "Expired"
                        : `Expires ${formatDate(q.valid_until)}`}
                    </div>
                  </div>
                  <div
                    className={`ai-tag ${isExpired(q.valid_until) ? "tag-urg" : "tag-warn"}`}
                  >
                    {isExpired(q.valid_until) ? "Expired" : "Expiring"}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="alert-item">
              <div
                className="alert-dot"
                style={{
                  background: "var(--green)",
                  marginTop: 6,
                  flexShrink: 0,
                }}
              />
              <div className="ai-body">
                <div className="ai-msg">No Expiring Quotes</div>
                <div className="ai-note">
                  All quotes are within validity period.
                </div>
              </div>
              <div className="ai-tag tag-ok">All Clear</div>
            </div>
          )}

          {/* Stale inquiries */}
          {alerts.staleInquiries?.length > 0 && (
            <div className="alert-item">
              <div
                className="alert-dot"
                style={{
                  background: "var(--amber)",
                  marginTop: 6,
                  flexShrink: 0,
                }}
              />
              <div className="ai-body">
                <div className="ai-msg">
                  {alerts.staleInquiries.length} Stale Inquiries
                </div>
                <div className="ai-note">
                  No activity in a while — follow up with clients.
                </div>
              </div>
              <div className="ai-tag tag-warn">Stale</div>
            </div>
          )}

          {/* Estimates ready for quote */}
          {alerts.estimatesReadyForQuote?.length > 0 && (
            <div className="alert-item">
              <div
                className="alert-dot"
                style={{
                  background: "var(--green)",
                  marginTop: 6,
                  flexShrink: 0,
                }}
              />
              <div className="ai-body">
                <div className="ai-msg">
                  {alerts.estimatesReadyForQuote.length} Estimates Ready to
                  Quote
                </div>
                <div className="ai-note">
                  Costing is done — create quotes now.
                </div>
              </div>
              <div className="ai-tag tag-ok">Ready</div>
            </div>
          )}
        </div>
      </div>

      {/* TWO COL — Recent Quotes + Top Clients */}
      <div className="two-col mb16">
        {/* RECENT QUOTES */}
        <div className="card card-pad">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Quotes</div>
              <div className="card-sub">Latest quotes sent to clients</div>
            </div>
            <span className="card-action" onClick={() => navigate("/quotes")}>
              View All →
            </span>
          </div>
          <table className="erp-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Client</th>
                <th>Margin</th>
                <th>Value</th>
                <th>Valid Until</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="dash-empty-cell">
                    No recent quotes.
                  </td>
                </tr>
              ) : (
                recentActivity.quotes.map((q) => {
                  const expired = isExpired(q.valid_until);
                  return (
                    <tr
                      key={q.id}
                      style={{
                        opacity: expired && q.status !== "accepted" ? 0.65 : 1,
                      }}
                    >
                      <td>
                        <span className="td-id">{q.quote_code}</span>
                      </td>
                      <td>
                        <div className="td-main">{q.client_name}</div>
                        <div className="td-meta">{q.style_name}</div>
                      </td>
                      <td className="td-meta">{parseFloat(q.margin_pct)}%</td>
                      <td className="td-main">{fmt(q.total_value)}</td>
                      <td>
                        <div
                          style={{
                            fontSize: 12,
                            color: expired ? "var(--red)" : "var(--g700)",
                            fontWeight: expired ? 600 : 400,
                          }}
                        >
                          {formatDate(q.valid_until)}
                        </div>
                        {expired && (
                          <div style={{ fontSize: 10, color: "var(--red)" }}>
                            Expired
                          </div>
                        )}
                      </td>
                      <td>
                        <span
                          className={`role-badge ${QUOTE_STATUS_BADGE[q.status] || "rb-vendor"}`}
                        >
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* TOP CLIENTS */}
        <div className="card card-pad">
          <div className="card-header">
            <div>
              <div className="card-title">Top Clients</div>
              <div className="card-sub">
                Clients by inquiry and quote activity
              </div>
            </div>
            <span className="card-action" onClick={() => navigate("/clients")}>
              All Clients →
            </span>
          </div>
          {topClients.length === 0 ? (
            <div className="dash-empty-cell">No client data yet.</div>
          ) : (
            <div
              className="client-grid"
              style={{ gridTemplateColumns: "1fr 1fr" }}
            >
              {topClients.map((client, idx) => (
                <div key={client.id} className="client-card">
                  <div
                    className="cc-av"
                    style={{
                      background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                    }}
                  >
                    {client.client_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="cc-name">{client.client_name}</div>
                  <div className="cc-stat">
                    {client.total_inquiries} inquiries
                  </div>
                  <div className="cc-stat">{client.total_quotes} quotes</div>
                  <div className="cc-val">
                    {fmt(client.total_accepted_value)}
                  </div>
                  <div className="cc-note">Total accepted value</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
