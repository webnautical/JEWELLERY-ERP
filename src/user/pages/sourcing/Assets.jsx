import React, { useState } from "react";
import {
  useGetAllAssetsQuery,
  useImportMaterialsMutation,
} from "../../../api/RatesAPI";

import RefreshBTN from "../../../components/RefreshBTN";
import ImportExportBTN from "../../../helper/excel/ImportExportBTN";
import DownloadTemplate from "../../../helper/excel/DownloadTemplate";
import { AssetsHeaders } from "../../../helper/excel/TemplateHeaders";
import { Link } from "react-router-dom";
import { UNITS } from "../../../helper/Constant";

const INIT_FORM = { materialName: "", grade: "", unit: "" };
const INIT_ERRS = { materialName: "", grade: "", unit: "" };

const Assets = () => {
  const [filterStatus, setFilterStatus] = useState("");
  const [importMaterials] = useImportMaterialsMutation();

  const { data, isLoading, refetch } = useGetAllAssetsQuery({
    status: filterStatus,
  });

  const assets = data?.data || [];

  const dataForExcel = assets.length > 0
    ? assets.map(item => ({
      materialName: item?.material_name ?? "",
      unit: item?.unit ?? "",
      rate: parseFloat(item?.current_rate),
      rateDate: item?.rate_date?.split("T")[0]
    }))
    : [{ materialName: "", unit: "", rate: "", rateDate: "" }];

  return (
    <div className="page-wrapper">
      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">Material Assets</div>
          <div className="pg-sub">
            Manage materials and grades used in rate calculations — gold,
            silver, diamonds and more.
          </div>
        </div>
        <div className="btn-row">
          <ImportExportBTN
            data={dataForExcel}
            fileName="materials"
            dropdownColumns={[
              { sheetName: 'Units', values: UNITS },
            ]}

            maxRows={200}
            onImport={(formData) => importMaterials(formData).unwrap()}
            displayKeys={['materialName']}
          />
          <RefreshBTN refetch={refetch} />
          <Link to={'/rate'} className="btn btn-primary">
            ＋ Add Material
          </Link>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            All Materials
            <span
              style={{
                fontSize: 12,
                color: "var(--g500)",
                fontWeight: 400,
                marginLeft: 8,
              }}
            >
              ({assets.length} total)
            </span>
          </div>
          <div className="table-filters">
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
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
              <th>Material</th>
              <th>Grade / Type</th>
              <th>Unit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: 30,
                    color: "var(--g500)",
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : assets.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: 30,
                    color: "var(--g500)",
                  }}
                >
                  No materials found.
                </td>
              </tr>
            ) : (
              assets.map((asset, idx) => (
                <tr key={asset.id}>
                  <td style={{ color: "var(--g500)", fontSize: 11 }}>
                    {idx + 1}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{asset.material_name}</div>
                  </td>
                  <td style={{ color: "var(--g700)" }}>{asset.grade}</td>
                  <td
                    style={{
                      color: "var(--g700)",
                      textTransform: "capitalize",
                    }}
                  >
                    {asset.unit}
                  </td>
                  {/* <td style={{ color: "var(--g700)" }}>{asset.current_rate ?? "N/A"}</td> */}
                  <td>
                    <span
                      className={`pill ${asset.status === "active" ? "p-active" : "p-inactive"}`}
                    >
                      <span className="pdot" />
                      {asset.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="pagination">
          <div className="page-info">Showing {assets.length} materials</div>
        </div>
      </div>
    </div>
  );
};

export default Assets;
