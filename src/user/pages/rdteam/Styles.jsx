import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllStylesQuery,
  useArchiveStyleMutation,
  useStyleImportMutation,
} from "../../../api/RdAPI";
import {
  showConfirm,
  showSuccess,
  showError,
  imgBaseURL,
  timeAgo,
} from "../../../helper/Utility";
import DownloadTemplate from "../../../helper/excel/DownloadTemplate";
import { StyleHeaders } from "../../../helper/excel/TemplateHeaders";
import ImportExportBTN from "../../../helper/excel/ImportExportBTN";
import Pagination from "../../../components/Pagination";
import { PER_PAGE_ITEMS } from "../../../helper/Constant";
import RefreshBTN from "../../../components/RefreshBTN";

const Styles = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("active");
  const [limit, setLimit] = useState(PER_PAGE_ITEMS)
  const [styleImport] = useStyleImportMutation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const { data, isLoading, refetch } = useGetAllStylesQuery({
    status: filterStatus,
    limit,
    page,
    search: debouncedSearch
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
          <DownloadTemplate
            headers={StyleHeaders}
            fileName="Styles_Template.xlsx"
          />
          <ImportExportBTN
            data={styles}
            fileName="styles"
            onImport={(formData) => styleImport(formData).unwrap()}
            displayKeys={['style_code', 'style_name']}
          />
          <RefreshBTN refetch={refetch} />

          <button className="btn btn-primary" onClick={() => navigate("/styles/add")}>
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
              placeholder="Search style name, material..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

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
              <th>Style Code</th>
              <th>Style Name</th>
              <th>Material</th>
              <th>Stone</th>
              <th>Plating Thickness</th>
              <th>Status</th>
              <th>Created at</th>
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
                    <td style={{ color: "var(--g700)" }}>
                      {style.style_code || "—"}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{style.style_name}</div>
                      {style.special_instruction && (
                        <div className="td-meta">
                          {style.special_instruction.slice(0, 45)}
                          {style.special_instruction.length > 45 ? "…" : ""}
                        </div>
                      )}
                    </td>
                    <td style={{ color: "var(--g700)" }}>
                      {style.material || "—"}
                    </td>
                    <td style={{ color: "var(--g700)" }}>
                      {style.stone}
                    </td>
                    <td style={{ color: "var(--g700)" }}>
                      {style.plating_thickness || "—"}
                    </td>
                    <td>
                      <span
                        className={`pill ${style.status === "active" ? "p-active" : "p-inactive"}`}
                      >
                        <span className="pdot" />
                        {style.status === "active" ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td style={{ fontSize: 11.5, color: "var(--g500)" }}>
                      {timeAgo(style.created_at)}
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

        <Pagination name={"styles"} length={styles.length} totalRecord={totalRecs} page={page} setPage={setPage} totalPages={totalPages} limit={limit} setLimit={setLimit} />

      </div>
    </div>
  );
};

export default Styles;
