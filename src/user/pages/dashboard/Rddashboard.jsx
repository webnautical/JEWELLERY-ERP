import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetRDDashboardQuery } from "../../../api/RdAPI";
import { formatDate } from "../../../helper/Utility";

const ORIGIN_LABELS = {
    in_house:      "In-House",
    client_design: "Client Design",
    market_sample: "Market Sample",
};

const ORIGIN_BADGE = {
    in_house:      "rb-rd",
    client_design: "rb-sales",
    market_sample: "rb-sourcing",
};

const RDDashboard = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetRDDashboardQuery();
    const d = data?.data;

    if (isLoading) {
        return (
            <div className="content">
                <div className="dash-loading">Loading dashboard...</div>
            </div>
        );
    }

    if (!d) return null;

    const { overview, mostUsedStyles, recentStyles, alerts } = d;

    const activeCount = parseInt(overview.byStatus.find(s => s.status === "active")?.count || 0);
    const archivedCount = parseInt(overview.byStatus.find(s => s.status === "archived")?.count || 0);

    return (
        <div className="content">

            {/* PAGE HEADER */}
            <div className="pg-header">
                <div>
                    <div className="pg-title">RD Dashboard</div>
                    <div className="pg-sub">Overview of styles, designs and material configurations.</div>
                </div>
                <div className="btn-row">
                    <button className="btn btn-outline" onClick={() => navigate("/styles")}>All Styles</button>
                    <button className="btn btn-primary" onClick={() => navigate("/styles/add")}>＋ Add Style</button>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="kpi-grid mb20">
                <div className="kpi-card dark">
                    <div className="kpi-label">Total Styles</div>
                    <div className="kpi-val">{overview.totalStyles}</div>
                    <div className="kpi-note">{overview.byOrigin.length} origin types</div>
                    <div className="kpi-bar"><div className="kpi-bar-fill" style={{ width: "100%", background: "var(--red)" }} /></div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">My Styles</div>
                    <div className="kpi-val" style={{ color: "var(--green)" }}>{overview.myStyles}</div>
                    <div className="kpi-note up">Created by you</div>
                    <div className="kpi-bar"><div className="kpi-bar-fill" style={{ width: `${Math.round(overview.myStyles / (overview.totalStyles || 1) * 100)}%`, background: "var(--green)" }} /></div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">This Month</div>
                    <div className="kpi-val">{overview.stylesThisMonth}</div>
                    <div className="kpi-note">New styles added</div>
                    <div className="kpi-bar"><div className="kpi-bar-fill" style={{ width: "50%" }} /></div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Active</div>
                    <div className="kpi-val" style={{ color: "var(--green)" }}>{activeCount}</div>
                    <div className="kpi-note">{archivedCount} archived</div>
                    <div className="kpi-bar"><div className="kpi-bar-fill" style={{ width: `${Math.round(activeCount / (overview.totalStyles || 1) * 100)}%`, background: "var(--green)" }} /></div>
                </div>
                {overview.byOrigin.map((o) => (
                    <div key={o.origin} className="kpi-card">
                        <div className="kpi-label">{ORIGIN_LABELS[o.origin] || o.origin}</div>
                        <div className="kpi-val">{o.count}</div>
                        <div className="kpi-note">By origin</div>
                        <div className="kpi-bar"><div className="kpi-bar-fill" style={{ width: `${Math.round(parseInt(o.count) / (overview.totalStyles || 1) * 100)}%` }} /></div>
                    </div>
                ))}
            </div>

            {/* TWO COL — Most Used + Alerts */}
            <div className="two-col mb16">

                {/* MOST USED STYLES */}
                <div className="card card-pad">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Most Used Styles</div>
                            <div className="card-sub">Styles with highest inquiry count</div>
                        </div>
                        <span className="card-action" onClick={() => navigate("/styles")}>View All →</span>
                    </div>
                    <table className="erp-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Style</th>
                                <th>Metal Type</th>
                                <th>Inquiries</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mostUsedStyles.length === 0 ? (
                                <tr><td colSpan={5} className="dash-empty-cell">No data yet.</td></tr>
                            ) : mostUsedStyles.map((s, idx) => (
                                <tr key={s.id}>
                                    <td className="td-meta">{idx + 1}</td>
                                    <td>
                                        <div className="td-main">{s.style_name}</div>
                                        <div className="td-meta">{s.style_code}</div>
                                    </td>
                                    <td className="td-meta">{s.metal_type || "—"}</td>
                                    <td>
                                        <span className="role-badge rb-sales">{s.inquiry_count} inquiries</span>
                                    </td>
                                    <td>
                                        <button className="btn-sm" onClick={() => navigate(`/styles/edit/${s.id}`)}>View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ALERTS */}
                <div className="card card-pad">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Alerts</div>
                            <div className="card-sub">Items requiring your attention</div>
                        </div>
                    </div>

                    {alerts.stylesWithoutBOM?.length > 0 ? (
                        <div className="alert-item">
                            <div className="alert-dot" style={{ background: "var(--amber)", marginTop: 6, flexShrink: 0 }} />
                            <div className="ai-body">
                                <div className="ai-msg">{alerts.stylesWithoutBOM.length} Styles Without BOM</div>
                                <div className="ai-note">These styles have no Bill of Materials attached.</div>
                            </div>
                            <div className="ai-tag tag-warn">Action</div>
                        </div>
                    ) : (
                        <div className="alert-item">
                            <div className="alert-dot" style={{ background: "var(--green)", marginTop: 6, flexShrink: 0 }} />
                            <div className="ai-body">
                                <div className="ai-msg">All Styles Have BOMs</div>
                                <div className="ai-note">Every active style has a Bill of Materials.</div>
                            </div>
                            <div className="ai-tag tag-ok">All Clear</div>
                        </div>
                    )}

                    {alerts.draftStyles?.length > 0 ? (
                        <div className="alert-item">
                            <div className="alert-dot" style={{ background: "var(--amber)", marginTop: 6, flexShrink: 0 }} />
                            <div className="ai-body">
                                <div className="ai-msg">{alerts.draftStyles.length} Draft Styles</div>
                                <div className="ai-note">These styles are still in draft — publish when ready.</div>
                            </div>
                            <div className="ai-tag tag-warn">Draft</div>
                        </div>
                    ) : (
                        <div className="alert-item">
                            <div className="alert-dot" style={{ background: "var(--green)", marginTop: 6, flexShrink: 0 }} />
                            <div className="ai-body">
                                <div className="ai-msg">No Draft Styles</div>
                                <div className="ai-note">All styles are published and active.</div>
                            </div>
                            <div className="ai-tag tag-ok">All Clear</div>
                        </div>
                    )}
                </div>
            </div>

            {/* RECENT STYLES */}
            <div className="card card-pad mb16">
                <div className="card-header">
                    <div>
                        <div className="card-title">Recent Styles</div>
                        <div className="card-sub">Latest styles added to the system</div>
                    </div>
                    <span className="card-action" onClick={() => navigate("/styles")}>View All →</span>
                </div>
                <table className="erp-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Style</th>
                            <th>Metal Type</th>
                            <th>Origin</th>
                            <th>Status</th>
                            <th>Created By</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentStyles.length === 0 ? (
                            <tr><td colSpan={8} className="dash-empty-cell">No styles yet.</td></tr>
                        ) : recentStyles.map((s, idx) => (
                            <tr key={s.id}>
                                <td className="td-meta">{idx + 1}</td>
                                <td>
                                    <div className="td-main">{s.style_name}</div>
                                    <div className="td-meta">{s.style_code}</div>
                                </td>
                                <td className="td-meta">{s.metal_type || "—"}</td>
                                <td>
                                    <span className={`role-badge ${ORIGIN_BADGE[s.origin] || "rb-vendor"}`}>
                                        {ORIGIN_LABELS[s.origin] || s.origin}
                                    </span>
                                </td>
                                <td>
                                    <span className={`pill ${s.status === "active" ? "p-active" : "p-inactive"}`}>
                                        <span className="pdot" />{s.status}
                                    </span>
                                </td>
                                <td className="td-meta">{s.created_by_name}</td>
                                <td className="td-meta">{formatDate(s.created_at)}</td>
                                <td>
                                    <button className="btn-sm" onClick={() => navigate(`/styles/edit/${s.id}`)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default RDDashboard;