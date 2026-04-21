import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  showConfirm,
  showSuccess,
  showError,
  imgBaseURL,
  formatDate,
} from "../../../../helper/Utility";
import {
  useGetAllStylesQuery,
  useArchiveStyleMutation,
} from "../../../../api/RdAPI";
import ImgCom from "../../../../components/ImgCom";

const ORIGIN_OPTIONS = [
  { value: "in_house", label: "In-House" },
  { value: "client_design", label: "Client Design" },
  { value: "market_sample", label: "Market Sample" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

const originBadge = (origin) => {
  const map = {
    in_house: { cls: "rb-rd", label: "In-House" },
    client_design: { cls: "rb-sales", label: "Client Design" },
    market_sample: { cls: "rb-sourcing", label: "Market Sample" },
  };
  const m = map[origin] || { cls: "rb-vendor", label: origin };
  return <span className={`role-badge ${m.cls}`}>{m.label}</span>;
};

const Styles = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("active");
  const [filterOrigin, setFilterOrigin] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, refetch } = useGetAllStylesQuery({
    status: filterStatus,
    origin: filterOrigin,
    search,
    page,
    limit,
  });
  const [archiveStyle] = useArchiveStyleMutation();

  const styles = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalRecs = data?.totalRecords ?? 0;

  const handleArchive = async (style) => {
    const confirm = await showConfirm(
      `"${style.style_name}" will be archived and removed from active use.`,
      "Archive Style?",
    );
    if (!confirm.isConfirmed) return;
    try {
      await archiveStyle(style.id).unwrap();
      showSuccess("Style archived successfully.");
      refetch();
    } catch (err) {
      showError(err?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="page-wrapper">
      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">Styles</div>
          <div className="pg-sub">
            Manage jewelry styles — designs, BOMs, and material configurations.
          </div>
        </div>
        <div className="btn-row">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/styles/add")}
          >
            ＋ Add Style
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            All Styles
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
            <input
              className="filter-inp"
              placeholder="Search style name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <select
              className="filter-select"
              value={filterOrigin}
              onChange={(e) => {
                setFilterOrigin(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Origins</option>
              {ORIGIN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Style Name</th>
              <th>Metal Type</th>
              <th>Metal Wt.</th>
              <th>Plating</th>
              <th>Origin</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={10}
                  style={{
                    textAlign: "center",
                    padding: 30,
                    color: "var(--g500)",
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : styles.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  style={{
                    textAlign: "center",
                    padding: 30,
                    color: "var(--g500)",
                  }}
                >
                  No styles found.
                </td>
              </tr>
            ) : (
              styles.map((style, idx) => {
                return (
                  <tr key={style.id}>
                    <td style={{ color: "var(--g500)", fontSize: 11 }}>
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td>
                      <ImgCom img={style?.images?.[0]} />
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{style.style_name}</div>
                      {style.description && (
                        <div className="td-meta">
                          {style.description.slice(0, 40)}
                          {style.description.length > 40 ? "…" : ""}
                        </div>
                      )}
                    </td>
                    <td style={{ color: "var(--g700)" }}>
                      {style.metal_type || "—"}
                    </td>
                    <td style={{ color: "var(--g700)" }}>
                      {style.metal_weight ? `${style.metal_weight}g` : "—"}
                    </td>
                    <td style={{ color: "var(--g700)" }}>
                      {style.plating || "—"}
                    </td>
                    <td>{originBadge(style.origin)}</td>
                    <td>
                      <span
                        className={`pill ${style.status === "active" ? "p-active" : "p-inactive"}`}
                      >
                        <span className="pdot" />
                        {style.status === "active" ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td style={{ fontSize: 11.5, color: "var(--g500)" }}>
                      {formatDate(style.created_at)}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn-sm"
                          onClick={() => navigate(`/styles/edit/${style.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-sm"
                          onClick={() => navigate(`/styles/view/${style.id}`)}
                        >
                          View
                        </button>
                        {style.status === "active" && (
                          <button
                            className="btn-sm-red"
                            onClick={() => handleArchive(style)}
                          >
                            Archive
                          </button>
                        )}
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
            Showing {styles.length} of {totalRecs} styles
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

export default Styles;
