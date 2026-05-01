import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetTableRowDetailQuery } from "../../../../api/AdminAPI";
import { formatLabel, imgBaseURL } from "../../../../helper/Utility";

const BASE_URL = imgBaseURL();

const DataDetail = () => {
  const { page: tableName, id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetTableRowDetailQuery({ table: tableName, id });
  const row = data?.data || {};
  const actions = data?.actions || {};

  const isImagePath = (value) =>
    typeof value === "string" && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value);

  const isFilePath = (value) =>
    typeof value === "string" && /\.(pdf|dwg|dxf|doc|docx|xlsx|zip|rar)$/i.test(value);

  const isDateField = (key) =>
    key.includes("_at") || key.includes("_date") || key.includes("date_");

  const isStatusField = (key) => key === "status" || key === "request_status";

  const statusColorMap = {
    active:    { bg: "#eaf3de", color: "#3b6d11", dot: "#639922" },
    inactive:  { bg: "#f1efe8", color: "#5f5e5a", dot: "#888780" },
    pending:   { bg: "#faeeda", color: "#854f0b", dot: "#ba7517" },
    completed: { bg: "#eaf3de", color: "#3b6d11", dot: "#639922" },
    draft:     { bg: "#e6f1fb", color: "#185fa5", dot: "#378add" },
    cancelled: { bg: "#fcebeb", color: "#a32d2d", dot: "#e24b4a" },
  };

  const extColorMap = {
    PDF:  { bg: "#fcebeb", color: "#a32d2d" },
    DWG:  { bg: "#faeeda", color: "#854f0b" },
    DXF:  { bg: "#faeeda", color: "#854f0b" },
    DOC:  { bg: "#e6f1fb", color: "#185fa5" },
    DOCX: { bg: "#e6f1fb", color: "#185fa5" },
    XLSX: { bg: "#eaf3de", color: "#3b6d11" },
    ZIP:  { bg: "#eeedfe", color: "#534ab7" },
    RAR:  { bg: "#eeedfe", color: "#534ab7" },
  };

  const StatusPill = ({ value }) => {
    const s = statusColorMap[value] || statusColorMap.inactive;
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: s.bg, color: s.color,
        padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </span>
    );
  };

  const ExtBadge = ({ ext }) => {
    const s = extColorMap[ext] || { bg: "#f1efe8", color: "#5f5e5a" };
    return (
      <span style={{
        background: s.bg, color: s.color,
        fontSize: 10, fontWeight: 700, padding: "2px 7px",
        borderRadius: 4, letterSpacing: "0.5px", flexShrink: 0,
      }}>
        {ext}
      </span>
    );
  };

  const renderValue = (key, value) => {
    if (value === null || value === undefined || value === "") {
      return <span style={{ color: "var(--g400)", fontSize: 13 }}>—</span>;
    }

    // ── Array ──
    if (Array.isArray(value)) {
      if (value.length === 0)
        return <span style={{ color: "var(--g400)" }}>—</span>;

      // Array of images
      if (value.every((v) => isImagePath(v))) {
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 6 }}>
            {value.map((src, i) => (
              <a key={i} href={`${BASE_URL}${src}`} target="_blank" rel="noreferrer"
                style={{ display: "block", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" }}>
                <img src={`${BASE_URL}${src}`} alt={`img-${i}`}
                  style={{ width: 90, height: 90, objectFit: "cover", display: "block" }} />
              </a>
            ))}
          </div>
        );
      }

      // Array of files
      if (value.every((v) => isFilePath(v))) {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
            {value.map((src, i) => {
              const fileName = src.split("/").pop();
              const ext = fileName.split(".").pop().toUpperCase();
              return (
                <a key={i} href={`${BASE_URL}${src}`} target="_blank" rel="noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    textDecoration: "none", padding: "7px 12px",
                    background: "var(--g50)", border: "1px solid var(--border)",
                    borderRadius: 8, width: "fit-content",
                  }}>
                  <ExtBadge ext={ext} />
                  <span style={{ fontSize: 12, color: "var(--g700)", fontWeight: 500 }}>{fileName}</span>
                  <span style={{ fontSize: 11, color: "var(--g400)", marginLeft: 2 }}>↗</span>
                </a>
              );
            })}
          </div>
        );
      }

      // Array of objects (e.g. stone_details)
      if (value.every((v) => typeof v === "object" && v !== null)) {
        const objKeys = Object.keys(value[0]);
        return (
          <div style={{ marginTop: 8, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "var(--g50)" }}>
                  {objKeys.map((k) => (
                    <th key={k} style={{
                      textAlign: "left", padding: "8px 12px",
                      color: "var(--g500)", fontWeight: 600,
                      textTransform: "uppercase", fontSize: 10,
                      letterSpacing: "0.5px", borderBottom: "1px solid var(--border)",
                    }}>
                      {formatLabel(k)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {value.map((obj, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "var(--g25)" }}>
                    {objKeys.map((k) => (
                      <td key={k} style={{
                        padding: "8px 12px", fontSize: 13,
                        color: "var(--g800)", borderBottom: i < value.length - 1 ? "1px solid var(--border)" : "none",
                      }}>
                        {obj[k] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      // Array of primitives
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 4 }}>
          {value.map((v, i) => (
            <span key={i} style={{
              background: "var(--g100)", border: "1px solid var(--border)",
              borderRadius: 6, padding: "3px 10px", fontSize: 12, color: "var(--g700)",
            }}>
              {String(v)}
            </span>
          ))}
        </div>
      );
    }

    // ── Nested object (e.g. cad_dimensions) ──
    if (typeof value === "object") {
      return (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8,
          background: "var(--g50)", borderRadius: 8, padding: "12px 14px",
          border: "1px solid var(--border)",
        }}>
          {Object.entries(value).map(([k, v]) => (
            <div key={k} style={{
              background: "var(--white)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "8px 14px", minWidth: 90,
            }}>
              <div style={{ fontSize: 10, color: "var(--g400)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                {formatLabel(k)}
              </div>
              <div style={{ fontSize: 15, color: "var(--g900)", fontWeight: 500 }}>
                {v ?? "—"}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ── Single image ──
    if (isImagePath(value)) {
      return (
        <a href={`${BASE_URL}${value}`} target="_blank" rel="noreferrer"
          style={{ display: "inline-block", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)", marginTop: 6 }}>
          <img src={`${BASE_URL}${value}`} alt={key}
            style={{ width: 100, height: 100, objectFit: "cover", display: "block" }} />
        </a>
      );
    }

    // ── Single file ──
    if (isFilePath(value)) {
      const fileName = value.split("/").pop();
      const ext = fileName.split(".").pop().toUpperCase();
      return (
        <a href={`${BASE_URL}${value}`} target="_blank" rel="noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            textDecoration: "none", padding: "7px 12px", marginTop: 6,
            background: "var(--g50)", border: "1px solid var(--border)",
            borderRadius: 8,
          }}>
          <ExtBadge ext={ext} />
          <span style={{ fontSize: 12, color: "var(--g700)", fontWeight: 500 }}>{fileName}</span>
          <span style={{ fontSize: 11, color: "var(--g400)" }}>↗</span>
        </a>
      );
    }

    // ── Date ──
    if (isDateField(key) && !isNaN(Date.parse(value))) {
      return (
        <span style={{ fontSize: 13, color: "var(--g700)" }}>
          {new Date(value).toLocaleString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </span>
      );
    }

    // ── Boolean ──
    if (typeof value === "boolean") {
      return (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: value ? "#eaf3de" : "#f1efe8",
          color: value ? "#3b6d11" : "#5f5e5a",
          padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500,
        }}>
          {value ? "Yes" : "No"}
        </span>
      );
    }

    // ── Status pill ──
    if (isStatusField(key)) {
      return <StatusPill value={String(value)} />;
    }

    // ── Default ──
    return <span style={{ fontSize: 13, color: "var(--g800)" }}>{String(value)}</span>;
  };

  // ── Section divider — groups field visually ────────────────────────────
  const isWideField = (value) =>
    Array.isArray(value) ||
    (typeof value === "object" && value !== null) ||
    isImagePath(String(value ?? "")) ||
    isFilePath(String(value ?? ""));

  const entries = Object.entries(row);

  return (
    <div className="page-wrapper">

      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">{formatLabel(tableName)} Details</div>
          <div className="pg-sub">Record #{id} &nbsp;·&nbsp; {tableName}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-sm" onClick={() => navigate(-1)}>← Back</button>
          {actions.isEdit && (
            <button className="btn-sm" onClick={() => navigate(`/dataList/${tableName}/edit/${id}`)}>
              Edit
            </button>
          )}
          {actions.isDelete && <button className="btn-sm-red">Delete</button>}
        </div>
      </div>

      {/* DETAIL CARD */}
      <div className="table-card" style={{ padding: 0, overflow: "hidden" }}>

        {/* Card Header */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: "#eeedfe", color: "#534ab7",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 600, flexShrink: 0,
            }}>
              {formatLabel(tableName).charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--g900)" }}>
                {formatLabel(tableName)} Information
              </div>
              <div style={{ fontSize: 12, color: "var(--g500)" }}>
                {entries.length} fields
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        {isLoading ? (
          <div style={{ padding: 60, textAlign: "center", color: "var(--g400)", fontSize: 13 }}>
            Loading...
          </div>
        ) : entries.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", color: "var(--g400)", fontSize: 13 }}>
            No record found.
          </div>
        ) : (
          <div style={{ padding: "8px 0" }}>
            {/* Normal fields grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              padding: "8px 24px 4px",
              gap: "0",
            }}>
              {entries
                .filter(([, v]) => !isWideField(v))
                .map(([key, value]) => (
                  <div key={key} style={{
                    padding: "12px 12px 12px 0",
                    borderBottom: "1px solid var(--border)",
                    minWidth: 0,
                  }}>
                    <div style={{
                      fontSize: 10, fontWeight: 600, color: "var(--g400)",
                      textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 5,
                    }}>
                      {formatLabel(key)}
                    </div>
                    <div>{renderValue(key, value)}</div>
                  </div>
                ))}
            </div>

            {/* Wide fields — each full width */}
            {entries
              .filter(([, v]) => isWideField(v))
              .map(([key, value]) => (
                <div key={key} style={{
                  padding: "14px 24px",
                  borderTop: "1px solid var(--border)",
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 600, color: "var(--g400)",
                    textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6,
                  }}>
                    {formatLabel(key)}
                  </div>
                  <div>{renderValue(key, value)}</div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataDetail;