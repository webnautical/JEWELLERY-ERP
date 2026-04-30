import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllStylesQuery,
  useArchiveStyleMutation,
} from "../../../api/RdAPI";
import {
  showConfirm,
  showSuccess,
  showError,
  imgBaseURL,
  formatDate,
} from "../../../helper/Utility";

const ORIGIN_OPTIONS = [
  { value: "in_house", label: "In-House" },
  { value: "client_design", label: "Client Design" },
  { value: "market_sample", label: "Market Sample" },
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

  // API filters — status & origin only (backend supported)
  const { data, isLoading, refetch } = useGetAllStylesQuery({
    status: filterStatus,
    origin: filterOrigin,
  });
  const [archiveStyle] = useArchiveStyleMutation();

  const allStyles = data?.data || [];

  // client-side search on name
  const styles = useMemo(() => {
    if (!search.trim()) return allStyles;
    const q = search.toLowerCase();
    return allStyles.filter(
      (s) =>
        s.style_name?.toLowerCase().includes(q) ||
        s.metal_type?.toLowerCase().includes(q),
    );
  }, [allStyles, search]);

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
              ({styles.length} total)
            </span>
          </div>
          <div className="table-filters">
            <input
              className="filter-inp"
              placeholder="Search name, metal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="filter-select"
              value={filterOrigin}
              onChange={(e) => setFilterOrigin(e.target.value)}
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
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
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
              <th>Weight</th>
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
                const images = style.images
                  ? typeof style.images === "string"
                    ? JSON.parse(style.images)
                    : style.images
                  : [];
                const thumb = images[0] ? `${imgBaseURL()}/${images[0]}` : null;
                return (
                  <tr key={style.id}>
                    <td style={{ color: "var(--g500)", fontSize: 11 }}>
                      {idx + 1}
                    </td>
                    <td>
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={style.style_name}
                          className="style-thumb"
                        />
                      ) : (
                        <div className="style-thumb-empty">No img</div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{style.style_name}</div>
                      {style.description && (
                        <div className="td-meta">
                          {style.description.slice(0, 45)}
                          {style.description.length > 45 ? "…" : ""}
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

        <div className="pagination">
          <div className="page-info">Showing {styles.length} styles</div>
        </div>
      </div>
    </div>
  );
};

export default Styles;
