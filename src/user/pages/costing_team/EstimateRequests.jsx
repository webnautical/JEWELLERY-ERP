import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetPendingEstimateRequestsQuery } from "../../../api/CostingAPI";
import { formatDate } from "../../../helper/Utility";

const EstimateRequests = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetPendingEstimateRequestsQuery({ page, limit });

  const requests   = data?.data         || [];
  const totalPages = data?.totalPages   || 1;
  const totalRecs  = data?.totalRecords ?? 0;

  return (
    <div className="page-wrapper">

      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">Pending Estimate Requests</div>
          <div className="pg-sub">Estimate requests from the sales team — review BOM items and fill in costs.</div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            Pending Requests
            <span style={{ fontSize: 12, color: "var(--g500)", fontWeight: 400, marginLeft: 8 }}>({totalRecs} total)</span>
          </div>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Style</th>
              <th>Client</th>
              <th>Qty</th>
              <th>BOM Revision</th>
              <th>Request Note</th>
              <th>Requested By</th>
              <th>Requested On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={9} style={{ textAlign: "center", padding: 30, color: "var(--g500)" }}>Loading...</td></tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: 40, color: "var(--g500)" }}>
               
                  <div style={{ fontWeight: 500 }}>No pending requests</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>All estimate requests have been completed.</div>
                </td>
              </tr>
            ) : requests.map((req, idx) => (
              <tr key={req.id}>
                <td style={{ color: "var(--g500)", fontSize: 11 }}>{(page - 1) * limit + idx + 1}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{req.style_name}</div>
                  <div className="td-meta">{req.style_code}</div>
                </td>
                <td style={{ color: "var(--g700)" }}>{req.client_name}</td>
                <td style={{ fontWeight: 500 }}>{req.quantity} pcs</td>
                <td><span className="role-badge rb-rd">Rev {req.revision_number}</span></td>
                <td>
                  <div style={{ fontSize: 12.5, color: "var(--g700)", maxWidth: 220 }}>
                    {req.request_note || "—"}
                  </div>
                </td>
                <td style={{ fontSize: 12, color: "var(--g500)" }}>{req.requested_by_name}</td>
                <td style={{ fontSize: 11.5, color: "var(--g500)" }}>{formatDate(req.created_at)}</td>
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
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pagination">
          <div className="page-info">Showing {requests.length} of {totalRecs} requests</div>
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

export default EstimateRequests;