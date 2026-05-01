import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetTableDataQuery } from "../../../../api/AdminAPI";
import { formatLabel } from "../../../../helper/Utility";
import { useTranslation } from "../../../../helper/useTranslation";

const DataListing = () => {
    const { t } = useTranslation();
  
  const params = useParams();
  const tableName = params.page;
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, refetch } = useGetTableDataQuery({ table: tableName, page, limit });

  const dataList = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalRecords = data?.totalRecords ?? dataList.length;

  const columns = dataList.length > 0 ? Object.keys(dataList[0]) : [];

  const actions = data?.actions || {};
  const hasAnyAction = Object.values(actions).some(Boolean);

  const formatHeader = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const formatValue = (key, value) => {
    if (value === null || value === undefined || value === "") return "—";

    if (
      typeof value === "string" &&
      (key.includes("_at") || key.includes("_date") || key.includes("date_")) &&
      !isNaN(Date.parse(value))
    ) {
      return new Date(value).toLocaleDateString("en-IN");
    }

    if (typeof value === "boolean") return value ? "Yes" : "No";

    if (key === "status" || key === "request_status") {
      const colorMap = {
        active: "p-active",
        inactive: "p-inactive",
        pending: "p-pending",
        completed: "p-active",
        draft: "p-inactive",
        cancelled: "p-inactive",
      };
      const pillClass = colorMap[value] || "p-inactive";
      return (
        <span className={`pill ${pillClass}`}>
          <span className="pdot" />
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      );
    }

    return String(value);
  };
  console.log("dataList", dataList)
  return (
    <div className="page-wrapper">
      <div className="pg-header">
        <div>
          <div className="pg-title"> {t(t(formatLabel(tableName)))}</div>
          <div className="pg-sub">{t('manageAll')} {t(formatLabel(tableName))} {t('records')}</div>
        </div>
        <div>
          <button type="button" className="btn btn-primary" onClick={() => refetch()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.36-3.36L23 10M1 14l5.13 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {t('refresh')}
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            {t('all')} {t(formatLabel(tableName))}
            <span style={{ fontSize: 12, color: "var(--g500)", fontWeight: 400, marginLeft: 8, }}>
              ({totalRecords} {t('total')})
            </span>
          </div>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>#</th>
              {columns.map((col) => (
                <th key={col}>{formatHeader(col)}</th>
              ))}
              {hasAnyAction && <th>{t('actions')}</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1 + (hasAnyAction ? 1 : 0)}
                  style={{ textAlign: "center", padding: 30, color: "var(--g500)", }}>
                  {t('loading')}
                </td>
              </tr>
            ) : dataList?.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1 + (hasAnyAction ? 1 : 0)}
                  style={{ textAlign: "center", padding: 30, color: "var(--g500)" }}>
                  {t('noRecordsFound')}
                </td>
              </tr>
            ) : (
              dataList?.map((row, idx) => (
                <tr key={row.id ?? idx}>
                  <td style={{ color: "var(--g500)", fontSize: 11 }}>
                    {(page - 1) * limit + idx + 1}
                  </td>
                  {columns.map((col) => (
                    <td key={col}>{formatValue(col, row[col])}</td>
                  ))}

                  {hasAnyAction && (
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        {actions.isView && (
                          <button className="btn-sm" onClick={() => navigate(`/dataList/${tableName}/view/${row.id}`)}>
                            {t('view')}
                          </button>
                        )}
                        {actions.isEdit && (
                          <button className="btn-sm" onClick={() => navigate(`/dataList/${tableName}/edit/${row.id}`)}>
                            {t('edit')}
                          </button>
                        )}
                        {actions.isDelete && (<button className="btn-sm-red">{t('delete')}</button>)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pagination">
          <div className="page-info">
            {t('showing')} {dataList.length} of {totalRecords}  {t(formatLabel(tableName))}
          </div>
          <div className="page-btns">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              {t('prev')}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              {t('next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DataListing;