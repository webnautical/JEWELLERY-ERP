import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetCostingDashboardQuery } from "../../../api/CostingAPI";
import { formatDate, CURRENCY_SIGN } from "../../../helper/Utility";

const fmt = (val) =>
  val != null && val !== ""
    ? `${CURRENCY_SIGN}${Number(val).toLocaleString("en-IN")}`
    : "—";

const CostingDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCostingDashboardQuery();
  const d = data?.data;

  if (isLoading) {
    return (
      <div className="content">
        <div className="dash-loading">Loading dashboard...</div>
      </div>
    );
  }

  if (!d) return null;

  const { overview, pendingRequests, recentCompleted, alerts } = d;

  const completedCount = parseInt(
    overview.byStatus.find((s) => s.request_status === "completed")?.count || 0,
  );
  const pendingCount = parseInt(
    overview.byStatus.find((s) => s.request_status === "pending")?.count || 0,
  );

  return (
    <div className="page-wrapper">
      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">Costing Dashboard</div>
          <div className="pg-sub">
            Overview of estimate requests, completions and material rate alerts.
          </div>
        </div>
        <div className="btn-row">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/estimate-requests")}
          >
            Pending Requests
            {pendingRequests.length > 0 && (
              <span className="dash-badge">{pendingRequests.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-grid mb20">
        <div className="kpi-card dark">
          <div className="kpi-label">Total Estimates</div>
          <div className="kpi-val">{overview.totalEstimates}</div>
          <div className="kpi-note">{overview.thisMonth} this month</div>
          <div className="kpi-bar">
            <div
              className="kpi-bar-fill"
              style={{ width: "100%", background: "var(--red)" }}
            />
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Pending Requests</div>
          <div
            className="kpi-val"
            style={{
              color:
                pendingRequests.length > 0 ? "var(--amber)" : "var(--green)",
            }}
          >
            {pendingRequests.length}
          </div>
          <div
            className="kpi-note"
            style={{
              color:
                pendingRequests.length > 0 ? "var(--amber)" : "var(--g500)",
            }}
          >
            {pendingRequests.length > 0 ? "Action required" : "All clear"}
          </div>
          <div className="kpi-bar">
            <div
              className="kpi-bar-fill"
              style={{
                width: `${Math.min(pendingRequests.length * 20, 100)}%`,
                background: "var(--amber)",
              }}
            />
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Completed</div>
          <div className="kpi-val" style={{ color: "var(--green)" }}>
            {completedCount}
          </div>
          <div className="kpi-note up">
            {overview.completedToday} completed today
          </div>
          <div className="kpi-bar">
            <div
              className="kpi-bar-fill"
              style={{
                width: `${Math.round((completedCount / (overview.totalEstimates || 1)) * 100)}%`,
                background: "var(--green)",
              }}
            />
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Avg Estimate Value</div>
          <div className="kpi-val">{fmt(overview.avgValue)}</div>
          <div className="kpi-note">Per estimate</div>
          <div className="kpi-bar">
            <div className="kpi-bar-fill" style={{ width: "60%" }} />
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">My Estimates</div>
          <div className="kpi-val">{overview.myEstimates}</div>
          <div className="kpi-note">Created by you</div>
          <div className="kpi-bar">
            <div
              className="kpi-bar-fill"
              style={{
                width: `${Math.round((overview.myEstimates / (overview.totalEstimates || 1)) * 100)}%`,
              }}
            />
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Assets Missing Rate</div>
          <div
            className="kpi-val"
            style={{
              color:
                alerts.assetsWithoutRate?.length > 0
                  ? "var(--red)"
                  : "var(--green)",
            }}
          >
            {alerts.assetsWithoutRate?.length || 0}
          </div>
          <div
            className="kpi-note dn"
            style={{
              color:
                alerts.assetsWithoutRate?.length > 0
                  ? "var(--red)"
                  : "var(--g500)",
            }}
          >
            {alerts.assetsWithoutRate?.length > 0
              ? "Update rates"
              : "All rates set"}
          </div>
          <div className="kpi-bar">
            <div
              className="kpi-bar-fill"
              style={{
                width: `${Math.min((alerts.assetsWithoutRate?.length || 0) * 15, 100)}%`,
                background: "var(--red)",
              }}
            />
          </div>
        </div>
      </div>

      {/* TWO COL — Pending + Alerts */}
      <div className="two-col mb16">
        {/* PENDING REQUESTS */}
        <div className="card card-pad">
          <div className="card-header">
            <div>
              <div className="card-title">Pending Estimate Requests</div>
              <div className="card-sub">
                Requests from sales team awaiting costing
              </div>
            </div>
            <span
              className="card-action"
              onClick={() => navigate("/estimate-requests")}
            >
              View All →
            </span>
          </div>
          <table className="erp-table">
            <thead>
              <tr>
                <th>Inquiry</th>
                <th>Style</th>
                <th>Client</th>
                <th>Qty</th>
                <th>Requested By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="dash-empty-cell text-center">
                    <div style={{ fontSize: 22, marginBottom: 6 }}></div>
                    No pending requests — all caught up!
                  </td>
                </tr>
              ) : (
                pendingRequests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <span className="td-id">{req.inquiry_code}</span>
                    </td>
                    <td>
                      <div className="td-main">{req.style_name}</div>
                      <div className="td-meta">{req.style_code}</div>
                    </td>
                    <td className="td-main">{req.client_name}</td>
                    <td className="td-meta">{req.quantity} pcs</td>
                    <td className="td-meta">{req.requested_by_name}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        style={{ padding: "5px 14px", fontSize: 12 }}
                        onClick={() => navigate(`/estimate-form?id=${req.id}`)}
                      >
                        Create Estimate
                      </button>
                    </td>
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
              <div className="card-title">Alerts</div>
              <div className="card-sub">Items requiring your attention</div>
            </div>
          </div>

          {/* Overdue requests */}
          {alerts.overdueRequests?.length > 0 ? (
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
                  {alerts.overdueRequests.length} Overdue Estimate Requests
                </div>
                <div className="ai-note">
                  These requests have been waiting too long — action required.
                </div>
              </div>
              <div className="ai-tag tag-urg">Overdue</div>
            </div>
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
                <div className="ai-msg">No Overdue Requests</div>
                <div className="ai-note">
                  All estimate requests are being handled on time.
                </div>
              </div>
              <div className="ai-tag tag-ok">On Track</div>
            </div>
          )}

          {/* Assets without rate */}
          {alerts.assetsWithoutRate?.length > 0 ? (
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
                    {alerts.assetsWithoutRate.length} Assets Without Rate
                  </div>
                  <div className="ai-note">
                    These materials have no rate set — estimates may be
                    inaccurate.
                  </div>
                </div>
                <div className="ai-tag tag-urg">Action</div>
              </div>
              {alerts.assetsWithoutRate.map((asset) => (
                <div key={asset.id} className="alert-item">
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
                      {asset.material_name} {asset.grade}
                    </div>
                    <div className="ai-note">
                      Unit: {asset.unit} · No rate available
                    </div>
                  </div>
                  <div className="ai-tag tag-warn">No Rate</div>
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
                <div className="ai-msg">All Assets Have Rates</div>
                <div className="ai-note">
                  All material assets have current rates set.
                </div>
              </div>
              <div className="ai-tag tag-ok">All Clear</div>
            </div>
          )}
        </div>
      </div>

      {/* RECENT COMPLETED ESTIMATES */}
      <div className="card card-pad mb16">
        <div className="card-header">
          <div>
            <div className="card-title">Recently Completed Estimates</div>
            <div className="card-sub">
              Estimates completed by the costing team
            </div>
          </div>
          <span className="card-action" onClick={() => navigate("/estimates")}>
            View All →
          </span>
        </div>
        <table className="erp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Inquiry</th>
              <th>Style</th>
              <th>Client</th>
              <th>Qty</th>
              <th>Overhead</th>
              <th>Total Cost</th>
              <th>Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentCompleted.length === 0 ? (
              <tr>
                <td colSpan={9} className="dash-empty-cell">
                  No completed estimates yet.
                </td>
              </tr>
            ) : (
              recentCompleted.map((est, idx) => (
                <tr key={est.id}>
                  <td className="td-meta">{idx + 1}</td>
                  <td>
                    <span className="td-id">{est.inquiry_code}</span>
                  </td>
                  <td>
                    <div className="td-main">{est.style_name}</div>
                    <div className="td-meta">{est.style_code}</div>
                  </td>
                  <td className="td-main">{est.client_name}</td>
                  <td className="td-meta">{est.quantity} pcs</td>
                  <td className="td-meta">{parseFloat(est.overhead_pct)}%</td>
                  <td className="td-main">{fmt(est.total_cost)}</td>
                  <td className="td-meta">{formatDate(est.updated_at)}</td>
                  <td>
                    <button
                      className="btn-sm"
                      onClick={() => navigate(`/estimate-detail/${est.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CostingDashboard;
