import React, { useState } from "react";
import {
  useGetAllAssetsQuery,
  useCreateUpdateAssetMutation,
} from "../../../../api/RatesAPI";
import {
  showSuccess,
  showError,
  showConfirm,
} from "../../../../helper/Utility";

const UNITS = ["gram", "carat", "piece"];

const INIT_FORM = { materialName: "", grade: "", unit: "" };
const INIT_ERRS = { materialName: "", grade: "", unit: "" };

const Assets = () => {
  const [filterStatus, setFilterStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(INIT_FORM);
  const [errs, setErrs] = useState(INIT_ERRS);

  const { data, isLoading, refetch } = useGetAllAssetsQuery({
    status: filterStatus,
  });
  const [createUpdateAsset, { isLoading: saving }] =
    useCreateUpdateAssetMutation();

  const assets = data?.data || [];

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (name, value) => {
    if (name === "materialName")
      return !value.trim() ? "Material name is required." : "";
    if (name === "grade") return !value.trim() ? "Grade is required." : "";
    if (name === "unit") return !value ? "Unit is required." : "";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrs((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrs((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const validateAll = () => {
    const next = {
      materialName: validate("materialName", form.materialName),
      grade: validate("grade", form.grade),
      unit: validate("unit", form.unit),
    };
    setErrs(next);
    return Object.values(next).every((e) => !e);
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openCreate = () => {
    setForm(INIT_FORM);
    setErrs(INIT_ERRS);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (asset) => {
    setForm({
      materialName: asset.material_name,
      grade: asset.grade,
      unit: asset.unit,
    });
    setErrs(INIT_ERRS);
    setEditId(asset.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setForm(INIT_FORM);
    setErrs(INIT_ERRS);
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;
    try {
      const payload = editId ? { id: editId, ...form } : form;
      await createUpdateAsset(payload).unwrap();
      showSuccess(
        editId ? "Asset updated successfully." : "Asset created successfully.",
      );
      handleCancel();
      refetch();
    } catch (err) {
      showError(err?.data?.message || "Something went wrong.");
    }
  };

  const handleToggleStatus = async (asset) => {
    const newStatus = asset.status === "active" ? "inactive" : "active";
    const action = newStatus === "inactive" ? "deactivate" : "activate";
    const confirm = await showConfirm(
      `Are you sure you want to ${action} "${asset.material_name} ${asset.grade}"?`,
      `${action.charAt(0).toUpperCase() + action.slice(1)} Asset`,
    );
    if (!confirm.isConfirmed) return;
    try {
      await createUpdateAsset({
        id: asset.id,
        materialName: asset.material_name,
        grade: asset.grade,
        unit: asset.unit,
        status: newStatus,
      }).unwrap();
      showSuccess(`Asset ${action}d successfully.`);
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
          <div className="pg-title">Material Assets</div>
          <div className="pg-sub">
            Manage materials and grades used in rate calculations — gold,
            silver, diamonds and more.
          </div>
        </div>
        <div className="btn-row">
          {!showForm && (
            <button className="btn btn-primary" onClick={openCreate}>
              ＋ Add Asset
            </button>
          )}
        </div>
      </div>

      {/* FORM PANEL */}
      {showForm && (
        <div className="form-panel">
          <div className="form-panel-header">
            <div className="form-panel-title">
              {editId ? "Edit Asset" : "Add New Asset"}
            </div>
            <button
              className="btn btn-outline"
              style={{ padding: "5px 12px", fontSize: 12 }}
              onClick={handleCancel}
            >
              ✕ Cancel
            </button>
          </div>

          <div className="form-grid">
            <div className="form-grp">
              <label className="form-lbl">Material Name *</label>
              <input
                className={`form-inp ${errs.materialName ? "inp-error" : ""}`}
                name="materialName"
                placeholder="e.g. Gold, Diamond, Silver"
                value={form.materialName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errs.materialName && (
                <div className="field-err">{errs.materialName}</div>
              )}
            </div>

            <div className="form-grp">
              <label className="form-lbl">Grade / Type *</label>
              <input
                className={`form-inp ${errs.grade ? "inp-error" : ""}`}
                name="grade"
                placeholder="e.g. 18K, VS1, 925, Natural AA"
                value={form.grade}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errs.grade && <div className="field-err">{errs.grade}</div>}
            </div>

            <div className="form-grp">
              <label className="form-lbl">Unit *</label>
              <select
                className={`form-select ${errs.unit ? "inp-error" : ""}`}
                name="unit"
                value={form.unit}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select unit...</option>
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u.charAt(0).toUpperCase() + u.slice(1)}
                  </option>
                ))}
              </select>
              {errs.unit && <div className="field-err">{errs.unit}</div>}
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-outline" onClick={handleCancel}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editId
                  ? "💾 Update Asset"
                  : "💾 Save Asset"}
            </button>
          </div>
        </div>
      )}

      {/* TABLE CARD */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            All Assets
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
              <th>Actions</th>
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
                  No assets found.
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
                  <td>
                    <span
                      className={`pill ${asset.status === "active" ? "p-active" : "p-inactive"}`}
                    >
                      <span className="pdot" />
                      {asset.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn-sm"
                        onClick={() => openEdit(asset)}
                      >
                        Edit
                      </button>
                      <button
                        className={
                          asset.status === "active" ? "btn-sm-red" : "btn-sm"
                        }
                        onClick={() => handleToggleStatus(asset)}
                      >
                        {asset.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="pagination">
          <div className="page-info">Showing {assets.length} assets</div>
        </div>
      </div>
    </div>
  );
};

export default Assets;
