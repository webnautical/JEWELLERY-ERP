import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllClientsQuery, useUpdateClientTrustedMutation } from "../../../../api/SalesAPI";
import { useTranslation } from "../../../../helper/useTranslation";
import Pagination from "../../../../components/Pagination";
import ToggleBTN from "../../../../components/ToggleBTN";

const Clients = () => {
  const [updateClientTrusted, { isLoading: isUpdating }] = useUpdateClientTrustedMutation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("active");
  const limit = 10;

  const { data, isLoading, refetch } = useGetAllClientsQuery({
    status: filterStatus,
    page,
    limit,
  });

  const clients = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalRecs = data?.totalRecords ?? 0;

  const handleTrustedToggle = async (clientId, isTrusted) => {
    try {
      await updateClientTrusted({ id: clientId, is_trusted: isTrusted });
      refetch();
    } catch (err) {
      console.error("Failed to update trusted status", err);
    }
  };

  return (
    <div className="page-wrapper">

      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">{t("Clients")}</div>
          <div className="pg-sub">{t('passwordChangedSuccess')}</div>
        </div>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => navigate("/client-form")}>＋ {t("addClient")}</button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            {t("allClients")}
            <span style={{ fontSize: 12, color: "var(--g500)", fontWeight: 400, marginLeft: 8 }}>({totalRecs} {t("total")})</span>
          </div>
          <div className="table-filters">
            <select className="filter-select" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
              <option value="">{t("allStatus")}</option>
              <option value="active">{t("active")}</option>
              <option value="inactive">{t("inactive")}</option>
            </select>
          </div>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t("clientName")}</th>
              <th>{t("Email")}</th>
              <th>{t("Phone")}</th>
              <th>{t("Address")}</th>
              <th>{t("Status")}</th>
              <th>{t("Is Trusted")}</th>
              <th>{t("Actions")}</th>
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
                  <ToggleBTN
                    clientId={client.id}
                    isTrusted={client.is_trusted}
                    onToggle={handleTrustedToggle}
                  />
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn-sm" onClick={() => navigate(`/client-form?id=${client.id}`, { state: client })}>{t("edit")}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <Pagination name={"clients"} length={clients.length} totalRecord={totalRecs} page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default Clients;