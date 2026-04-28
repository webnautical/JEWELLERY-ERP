import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllEstimatesQuery } from "../../../../api/CostingAPI";
import { formatDate, CURRENCY_SIGN } from "../../../../helper/Utility";

const STATUS_MAP = {
  draft: { cls: "rb-vendor", label: "Draft" },
  completed: { cls: "rb-qc", label: "Completed" },
  approved: { cls: "rb-rd", label: "Approved" },
  rejected: { cls: "rb-sales", label: "Rejected" },
};

const fmt = (val) =>
  val != null && val !== ""
    ? `${CURRENCY_SIGN}${Number(val).toLocaleString("en-IN")}`
    : "—";

const Estimates = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [requestStatus, setRequestStatus] = useState("completed");
  const limit = 10;

  const { data, isLoading } = useGetAllEstimatesQuery({
    requestStatus,
    page,
    limit,
  });

  const estimates = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalRecs = data?.totalRecords ?? 0;

  return (
    <div className="page-wrapper">
      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">Estimates</div>
          <div className="pg-sub">
            All estimates created by the costing team — review cost breakdowns
            and proceed to quoting.
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            All Estimates
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
          <div className="table-filters">
            <select
              className="filter-select"
              value={requestStatus}
              onChange={(e) => {
                setRequestStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Inquiry</th>
              <th>Style</th>
              <th>Client</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Metal Cost</th>
              <th>Stone Cost</th>
              <th>Labor</th>
              <th>Plating</th>
              <th>Overhead</th>
              <th>Total / pc</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={15}
                  style={{
                    textAlign: "center",
                    padding: 30,
                    color: "var(--g500)",
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : estimates.length === 0 ? (
              <tr>
                <td
                  colSpan={15}
                  style={{
                    textAlign: "center",
                    padding: 30,
                    color: "var(--g500)",
                  }}
                >
                  No estimates found.
                </td>
              </tr>
            ) : (
              estimates.map((est, idx) => {
                const statusInfo = STATUS_MAP[est.status] || {
                  cls: "rb-vendor",
                  label: est.status,
                };
                return (
                  <tr key={est.id}>
                    <td style={{ color: "var(--g500)", fontSize: 11 }}>
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "var(--red)",
                          fontSize: 12,
                        }}
                      >
                        {est.inquiry_code}
                      </div>
                      <div className="td-meta">Rev {est.revision_number}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{est.style_name}</div>
                      <div className="td-meta">{est.style_code}</div>
                    </td>
                    <td style={{ color: "var(--g700)" }}>{est.client_name}</td>
                    <td>
                      <div style={{ fontSize: 12.5 }}>{est.product_desc}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{est.quantity} pcs</td>
                    <td style={{ color: "var(--g700)" }}>
                      {fmt(est.metal_cost)}
                    </td>
                    <td style={{ color: "var(--g700)" }}>
                      {fmt(est.stone_cost)}
                    </td>
                    <td style={{ color: "var(--g700)" }}>
                      {fmt(est.labor_cost)}
                    </td>
                    <td style={{ color: "var(--g700)" }}>
                      {fmt(est.plating_cost)}
                    </td>
                    <td style={{ color: "var(--g700)" }}>
                      {parseFloat(est.overhead_pct)}%
                    </td>
                    <td>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "var(--black)",
                          fontSize: 13,
                        }}
                      >
                        {fmt(est.total_cost)}
                      </div>
                      {est.target_price && (
                        <div
                          style={{
                            fontSize: 10.5,
                            color:
                              parseFloat(est.total_cost) <=
                              parseFloat(est.target_price)
                                ? "var(--green)"
                                : "var(--red)",
                            marginTop: 2,
                          }}
                        >
                          Target: {fmt(est.target_price)}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`role-badge ${statusInfo.cls}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td style={{ fontSize: 11.5, color: "var(--g500)" }}>
                      {formatDate(est.created_at)}
                    </td>
                    <td>
                      <button
                        className="btn-sm"
                        onClick={() => navigate(`/estimate-detail/${est.id}`)}
                      >
                        View
                      </button>
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
            Showing {estimates.length} of {totalRecs} estimates
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

export default Estimates;
