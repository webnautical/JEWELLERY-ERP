import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllClientsQuery } from "../../../../api/SalesAPI";

const Clients = () => {
  const navigate = useNavigate();
  const [page,         setPage]         = useState(1);
  const [filterStatus, setFilterStatus] = useState("active");
  const limit = 10;

  const { data, isLoading, refetch } = useGetAllClientsQuery({
    status: filterStatus,
    page,
    limit,
  });

  const clients    = data?.data         || [];
  const totalPages = data?.totalPages   || 1;
  const totalRecs  = data?.totalRecords ?? 0;

  return (
    <div className="page-wrapper">

      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">Clients</div>
          <div className="pg-sub">Manage all jewelry clients and their contact details.</div>
        </div>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => navigate("/client-form")}>＋ Add Client</button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            All Clients
            <span style={{ fontSize: 12, color: "var(--g500)", fontWeight: 400, marginLeft: 8 }}>({totalRecs} total)</span>
          </div>
          <div className="table-filters">
            <select className="filter-select" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Client Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 30, color: "var(--g500)" }}>Loading...</td></tr>
            ) : clients.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 30, color: "var(--g500)" }}>No clients found.</td></tr>
            ) : clients.map((client, idx) => (
              <tr key={client.id}>
                <td style={{ color: "var(--g500)", fontSize: 11 }}>{(page - 1) * limit + idx + 1}</td>
                <td><div style={{ fontWeight: 500 }}>{client.client_name}</div></td>
                <td style={{ color: "var(--g700)" }}>{client.email || "—"}</td>
                <td style={{ color: "var(--g700)" }}>{client.phone || "—"}</td>
                <td style={{ color: "var(--g700)" }}>{client.address || "—"}</td>
                <td>
                  <span className={`pill ${client.status === "active" ? "p-active" : "p-inactive"}`}>
                    <span className="pdot" />
                    {client.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn-sm" onClick={() => navigate(`/client-form?id=${client.id}`, { state: client })}>Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pagination">
          <div className="page-info">Showing {clients.length} of {totalRecs} clients</div>
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

export default Clients;