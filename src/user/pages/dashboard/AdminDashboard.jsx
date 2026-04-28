import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAdminDashboardQuery } from "../../../api/AdminAPI";
import { formatDate, CURRENCY_SIGN } from "../../../helper/Utility";

// ── Helpers ───────────────────────────────────────────────────────────────
const fmt = (val) =>
    val != null && val !== ""
        ? `${CURRENCY_SIGN}${Number(val).toLocaleString("en-IN")}`
        : "—";

const ROLE_LABELS = {
    admin:           "Admin",
    rd_team:         "RD Team",
    sourcing_team:   "Sourcing Team",
    sales_executive: "Sales Executive",
    costing_team:    "Costing Team",
    vendor:          "Vendor",
};

const ROLE_BADGE = {
    admin:           "rb-rd",
    rd_team:         "rb-rd",
    sourcing_team:   "rb-sourcing",
    sales_executive: "rb-sales",
    costing_team:    "rb-costing",
    vendor:          "rb-vendor",
};

const QUOTE_STATUS_BADGE = {
    draft:       "rb-vendor",
    sent:        "rb-sales",
    accepted:    "rb-qc",
    rejected:    "rb-rd",
    negotiating: "rb-costing",
    expired:     "rb-production",
};

const INQ_STATUS_BADGE = {
    new:            "rb-rd",
    reviewing:      "rb-sourcing",
    quoted:         "rb-sales",
    negotiating:    "rb-costing",
    accepted:       "rb-qc",
    rejected:       "rb-vendor",
    estimate_ready: "rb-qc",
    bom_in_progress:"rb-production",
    lost:           "rb-vendor",
};

const PIPELINE_STAGES = [
    { label: "New Inquiries",    key: "new_inquiries",    accent: "active" },
    { label: "BOM In Progress",  key: "bom_in_progress",  accent: "warn"   },
    { label: "Estimate Pending", key: "estimate_pending", accent: "warn"   },
    { label: "Estimate Ready",   key: "estimate_ready",   accent: ""       },
    { label: "Quoted",           key: "quoted",           accent: ""       },
    { label: "Negotiating",      key: "negotiating",      accent: "warn"   },
    { label: "Accepted",         key: "accepted",         accent: "good"   },
    { label: "Lost",             key: "lost",             accent: ""       },
];

// ── Dashboard ─────────────────────────────────────────────────────────────
const Dashboard = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetAdminDashboardQuery();
    const d = data?.data;

    if (isLoading) {
        return (
            <div className="content">
                <div className="dash-loading">Loading dashboard...</div>
            </div>
        );
    }

    if (!d) return null;

    const { users, styles, clients, inquiries, estimates, quotes, alerts, recentActivity } = d;

    // Quote status counts map
    const quoteStatusMap = {};
    quotes.byStatus.forEach((q) => { quoteStatusMap[q.status] = parseInt(q.count); });
    const sentQuotes  = quoteStatusMap["sent"]  || 0;
    const draftQuotes = quoteStatusMap["draft"] || 0;

    return (
        <div className="content">

            {/* PAGE HEADER */}
            <div className="pg-header">
                <div>
                    <div className="pg-title">Admin Dashboard</div>
                    <div className="pg-sub">
                        System-wide overview — users, styles, inquiries, estimates and quotes.
                    </div>
                </div>
                <div className="btn-row">
                    <button className="btn btn-outline" onClick={() => navigate("/users")}>Manage Users</button>
                    <button className="btn btn-primary" onClick={() => navigate("/inquiries")}>View Inquiries</button>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="kpi-grid mb20">
                <div className="kpi-card dark">
                    <div className="kpi-label">Pipeline Value</div>
                    <div className="kpi-val">{fmt(quotes.pipelineValue)}</div>
                    <div className="kpi-note up">Accepted: {fmt(quotes.acceptedValue)}</div>
                    <div className="kpi-bar"><div className="kpi-bar-fill" style={{ width: "80%", background: "var(--green)" }} /></div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Total Inquiries</div>
                    <div className="kpi-val">{inquiries.total}</div>
                    <div className="kpi-note">{inquiries.thisMonth} this month</div>
                    <div className="kpi-bar"><div className="kpi-bar-fill" style={{ width: "65%" }} /></div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Pending Estimates</div>
                    <div className="kpi-val" style={{ color: estimates.pendingCount > 0 ? "var(--amber)" : "var(--green)" }}>
                        {estimates.pendingCount}
                    </div>
                    <div className="kpi-note">Avg: {fmt(estimates.avgValue)}</div>
                    <div className="kpi-bar"><div className="kpi-bar-fill" style={{ width: `${Math.min(estimates.pendingCount * 10, 100)}%`, background: "var(--amber)" }} /></div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Quotes Sent</div>
                    <div className="kpi-val">{sentQuotes}</div>
                    <div className="kpi-note">{draftQuotes} in draft</div>
                    <div className="kpi-bar"><div className="kpi-bar-fill" style={{ width: "55%" }} /></div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Total Clients</div>
                    <div className="kpi-val" style={{ color: "var(--green)" }}>{clients.total}</div>
                    <div className="kpi-note up">+{clients.newThisMonth} this month</div>
                    <div className="kpi-bar"><div className="kpi-bar-fill" style={{ width: "50%", background: "var(--green)" }} /></div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Total Users</div>
                    <div className="kpi-val">{users.total}</div>
                    <div className="kpi-note">{users.byRole.length} roles · {styles.total} styles</div>
                    <div className="kpi-bar"><div className="kpi-bar-fill" style={{ width: "100%", background: "var(--red)" }} /></div>
                </div>
            </div>

            {/* PIPELINE SNAPSHOT */}
            <div className="card mb16">
                <div className="card-pad" style={{ paddingBottom: 0 }}>
                    <div className="card-header" style={{ marginBottom: 14 }}>
                        <div>
                            <div className="card-title">Inquiry Pipeline</div>
                            <div className="card-sub">Current distribution across all sales stages</div>
                        </div>
                        <span className="card-action" onClick={() => navigate("/inquiries")}>View All Inquiries →</span>
                    </div>
                </div>
                <div className="pipeline-grid">
                    {PIPELINE_STAGES.map((stage) => {
                        const count = parseInt(inquiries.pipeline[stage.key] || 0);
                        return (
                            <div key={stage.key} className="pipe-stage">
                                <div className={`pipe-accent ${stage.accent}`} />
                                <div className="ps-count" style={{
                                    color: stage.accent === "good" ? "var(--green)"
                                         : stage.accent === "active" ? "var(--red)"
                                         : stage.accent === "warn" ? "#8a5c00"
                                         : "inherit"
                                }}>
                                    {count}
                                </div>
                                <div className="ps-name">{stage.label}</div>
                                <div className="ps-tag">{count === 0 ? "None" : `${count} active`}</div>
                            </div>
                        );
                    })}
                </div>
                <div style={{ height: 14 }} />
            </div>

            {/* TWO COL — Alerts + Users by Role */}
            <div className="two-col mb16">

                {/* ALERTS */}
                <div className="card card-pad">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Alerts &amp; Reminders</div>
                            <div className="card-sub">Items requiring immediate attention</div>
                        </div>
                    </div>

                    {/* Last rate update */}
                    {alerts.lastRateUpdate && (
                        <div className="alert-item">
                            <div className="alert-dot" style={{ background: "var(--green)", marginTop: 6, flexShrink: 0 }} />
                            <div className="ai-body">
                                <div className="ai-msg">Last Rate Update</div>
                                <div className="ai-note">
                                    By {alerts.lastRateUpdate.updated_by_name} · {formatDate(alerts.lastRateUpdate.created_at, true)}
                                </div>
                            </div>
                            <div className="ai-tag tag-ok">Updated</div>
                        </div>
                    )}

                    {/* Assets without rate */}
                    {alerts.assetsWithoutRateToday?.length > 0 && (
                        <div className="alert-item">
                            <div className="alert-dot" style={{ background: "var(--red)", marginTop: 6, flexShrink: 0 }} />
                            <div className="ai-body">
                                <div className="ai-msg">{alerts.assetsWithoutRateToday.length} Assets Missing Today's Rate</div>
                                <div className="ai-note">Update rates before creating new estimates.</div>
                            </div>
                            <div className="ai-tag tag-urg">Action</div>
                        </div>
                    )}

                    {/* Expiring quotes */}
                    {alerts.expiringQuotes?.length > 0 ? (
                        <>
                            <div className="alert-item">
                                <div className="alert-dot" style={{ background: "var(--red)", marginTop: 6, flexShrink: 0 }} />
                                <div className="ai-body">
                                    <div className="ai-msg">{alerts.expiringQuotes.length} Quotes Expiring Soon</div>
                                    <div className="ai-note">Follow up before validity lapses.</div>
                                </div>
                                <div className="ai-tag tag-urg">Urgent</div>
                            </div>
                            {alerts.expiringQuotes.map((q) => (
                                <div key={q.id} className="alert-item">
                                    <div className="alert-dot" style={{ background: "var(--amber)", marginTop: 6, flexShrink: 0 }} />
                                    <div className="ai-body">
                                        <div className="ai-msg">{q.quote_code} — {q.client_name}</div>
                                        <div className="ai-note">{q.style_name} · {fmt(q.total_value)} · Expires {formatDate(q.valid_until)}</div>
                                    </div>
                                    <div className="ai-tag tag-warn">Expiring</div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="alert-item">
                            <div className="alert-dot" style={{ background: "var(--green)", marginTop: 6, flexShrink: 0 }} />
                            <div className="ai-body">
                                <div className="ai-msg">No Expiring Quotes</div>
                                <div className="ai-note">All quotes are within validity period.</div>
                            </div>
                            <div className="ai-tag tag-ok">All Clear</div>
                        </div>
                    )}

                    {/* Overdue estimates */}
                    {alerts.overdueEstimates?.length > 0 && (
                        <div className="alert-item">
                            <div className="alert-dot" style={{ background: "var(--red)", marginTop: 6, flexShrink: 0 }} />
                            <div className="ai-body">
                                <div className="ai-msg">{alerts.overdueEstimates.length} Overdue Estimates</div>
                                <div className="ai-note">Costing team action required.</div>
                            </div>
                            <div className="ai-tag tag-urg">Overdue</div>
                        </div>
                    )}
                </div>

                {/* USERS BY ROLE */}
                <div className="card card-pad">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Users by Role</div>
                            <div className="card-sub">{users.total} total users · {users.byStatus.find(s => s.status === "active")?.count || 0} active</div>
                        </div>
                        <span className="card-action" onClick={() => navigate("/users")}>Manage →</span>
                    </div>
                    <table className="erp-table">
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Count</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.byRole.map((r) => (
                                <tr key={r.role}>
                                    <td>
                                        <span className={`role-badge ${ROLE_BADGE[r.role] || "rb-vendor"}`}>
                                            {ROLE_LABELS[r.role] || r.role}
                                        </span>
                                    </td>
                                    <td className="td-main">{r.count}</td>
                                    <td>
                                        <span className="pill p-active"><span className="pdot" />Active</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TWO COL — Recent Inquiries + Recent Quotes */}
            <div className="two-col mb16">

                {/* RECENT INQUIRIES */}
                <div className="card card-pad">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Recent Inquiries</div>
                            <div className="card-sub">Latest client inquiries in the system</div>
                        </div>
                        <span className="card-action" onClick={() => navigate("/inquiries")}>View All →</span>
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
                                <tr><td colSpan={6} className="dash-empty-cell">No recent inquiries.</td></tr>
                            ) : recentActivity.inquiries.map((inq) => (
                                <tr key={inq.id}>
                                    <td><span className="td-id">{inq.inquiry_code}</span></td>
                                    <td className="td-main">{inq.client_name}</td>
                                    <td className="td-meta">{inq.product_desc}</td>
                                    <td className="td-meta">{inq.quantity} pcs</td>
                                    <td>
                                        <span className={`role-badge ${INQ_STATUS_BADGE[inq.status] || "rb-vendor"}`}>
                                            {inq.status.replace(/_/g, " ")}
                                        </span>
                                    </td>
                                    <td className="td-meta">{formatDate(inq.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* RECENT QUOTES */}
                <div className="card card-pad">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Recent Quotes</div>
                            <div className="card-sub">Latest quotes sent to clients</div>
                        </div>
                        <span className="card-action" onClick={() => navigate("/quotes")}>View All →</span>
                    </div>
                    <table className="erp-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Client</th>
                                <th>Style</th>
                                <th>Value</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivity.quotes.length === 0 ? (
                                <tr><td colSpan={5} className="dash-empty-cell">No recent quotes.</td></tr>
                            ) : recentActivity.quotes.map((q) => (
                                <tr key={q.id}>
                                    <td><span className="td-id">{q.quote_code}</span></td>
                                    <td className="td-main">{q.client_name}</td>
                                    <td className="td-meta">{q.style_name}</td>
                                    <td className="td-main">{fmt(q.total_value)}</td>
                                    <td>
                                        <span className={`role-badge ${QUOTE_STATUS_BADGE[q.status] || "rb-vendor"}`}>
                                            {q.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RECENT USERS */}
            <div className="card card-pad mb16">
                <div className="card-header">
                    <div>
                        <div className="card-title">Recent Users</div>
                        <div className="card-sub">Recently added system users</div>
                    </div>
                    <span className="card-action" onClick={() => navigate("/users")}>Manage →</span>
                </div>
                <table className="erp-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentActivity.users.map((u, idx) => (
                            <tr key={u.id}>
                                <td className="td-meta">{idx + 1}</td>
                                <td className="td-main">{u.first_name} {u.last_name}</td>
                                <td className="td-meta">{u.email}</td>
                                <td>
                                    <span className={`role-badge ${ROLE_BADGE[u.role] || "rb-vendor"}`}>
                                        {ROLE_LABELS[u.role] || u.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`pill ${u.status === "active" ? "p-active" : "p-inactive"}`}>
                                        <span className="pdot" />{u.status}
                                    </span>
                                </td>
                                <td className="td-meta">{formatDate(u.created_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default Dashboard;