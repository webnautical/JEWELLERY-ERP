import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetTableDataQuery } from "../../../../api/AdminAPI";
import { formatLabel, showError } from "../../../../helper/Utility";
import { useTranslation } from "../../../../helper/useTranslation";
import { useLazyMarkAllNotificationsReadQuery, useLazyMarkNotificationReadQuery } from "../../../../api/CommonAPI";
import LoadingBTN from './../../../../components/LoadingBTN';
import { navigateByNotification } from "../../../../helper/navigateByNotification";
import { HIDDEN_COLUMNS, PER_PAGE_ITEMS } from "../../../../helper/Constant";
import RefreshBTN from "../../../../components/RefreshBTN";
import Pagination from "../../../../components/Pagination";
import ImportExportBTN from "../../../../helper/excel/ImportExportBTN";

const DataListing = () => {
  const { t } = useTranslation();
  const params = useParams();
  const tableName = params.page;
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PER_PAGE_ITEMS)

  useEffect(() => {
    setPage(1)
  }, [tableName])
  const [markRead] = useLazyMarkNotificationReadQuery();
  const [markAllRead, { isLoading: isMarkingAll }] = useLazyMarkAllNotificationsReadQuery();
  const { data, isLoading, refetch } = useGetTableDataQuery({ table: tableName, page, limit });

  const dataList = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalRecords = data?.totalRecords ?? dataList.length;

  const hiddenCols = HIDDEN_COLUMNS[tableName] || [];
  const columns = dataList.length > 0
    ? Object.keys(dataList[0]).filter((col) => !hiddenCols.includes(col))
    : [];

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

  const customeStyle = (row) => {
    const data = {
      background: row?.is_read ? "" : "rgb(218 201 202 / 72%)"
    }
    if (tableName == "notifications") {
      return data
    } else {
      return {}
    }
  }

  const handleRowClick = async (item) => {
    if (tableName == "notifications") {
      try {
        if (!item?.is_read) {
          await markRead(item.id).unwrap();
          refetch()
        }
        navigateByNotification(item, navigate);
      } catch (err) {
        showError(err?.data?.message || "Something went wrong.");
      }
    } else {
      return;
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
      refetch()
    } catch (err) {
      showError(err?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="pg-header">
        <div>
          <div className="pg-title"> {t(t(formatLabel(tableName)))}</div>
          <div className="pg-sub">{t('manageAll')} {t(formatLabel(tableName))} {t('records')}</div>
        </div>
        <div className="btn-row">

          {
            tableName == "notifications" &&
            <>
              {isMarkingAll ? <LoadingBTN className={"btn btn-primary mx-2"} /> :
                <button className="btn btn-primary mx-2" onClick={handleMarkAllRead}>
                  Mark as all read
                </button>}
            </>
          }

          <ImportExportBTN
            data={dataList}
            fileName={tableName}
            isImport={false}
          />

          <RefreshBTN refetch={refetch} />
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
                <tr key={row.id ?? idx} style={{ ...customeStyle(row) }} onClick={() => handleRowClick(row)}>
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
        <Pagination name={tableName} length={dataList.length} totalRecord={totalRecords} page={page} setPage={setPage} totalPages={totalPages} limit={limit} setLimit={setLimit} />

      </div>
    </div>
  );
};
export default DataListing;