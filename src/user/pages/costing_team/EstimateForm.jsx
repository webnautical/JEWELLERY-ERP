import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetEstimateByIdQuery, useCreateEstimateMutation } from "../../../api/CostingAPI";
import { showSuccess, showError, formatDate, CURRENCY_SIGN } from "../../../helper/Utility";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (val) =>
  val != null && val !== "" ? `${CURRENCY_SIGN}${Number(val)}` : "—";

const materialTypeBadge = (type) => {
  const map = {
    metal: { cls: "rb-rd", label: "Metal" },
    stone: { cls: "rb-sales", label: "Stone" },
    labor: { cls: "rb-production", label: "Labor" },
    plating: { cls: "rb-costing", label: "Plating" },
    finding: { cls: "rb-qc", label: "Finding" },
    other: { cls: "rb-vendor", label: "Other" },
  };
  const m = map[type] || { cls: "rb-vendor", label: type };
  return <span className={`role-badge ${m.cls}`}>{m.label}</span>;
};

// ── Cost breakdown row ────────────────────────────────────────────────────────
const BreakdownRow = ({ label, value, isTotal, isNote }) => (
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: isTotal ? "10px 0 0" : "6px 0",
    borderTop: isTotal ? "1px solid var(--g200)" : "none",
    marginTop: isTotal ? 6 : 0,
  }}>
    <div style={{ fontSize: isTotal ? 13 : 12.5, fontWeight: isTotal ? 700 : 400, color: isNote ? "var(--g500)" : "var(--black)" }}>
      {label}
    </div>
    <div style={{ fontSize: isTotal ? 15 : 12.5, fontWeight: isTotal ? 700 : 500, color: isTotal ? "var(--red)" : "var(--black)" }}>
      {value}
    </div>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const EstimateForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [laborCost, setLaborCost] = useState("");
  const [platingCost, setPlatingCost] = useState("");
  const [overheadPct, setOverheadPct] = useState("");
  const [errs, setErrs] = useState({ laborCost: "", platingCost: "", overheadPct: "" });

  const { data: estimateData, isLoading: fetching } = useGetEstimateByIdQuery(id, { skip: !id });
  const [createEstimate, { isLoading: saving }] = useCreateEstimateMutation();

  const est = estimateData?.data || null;
  const bomItems = est?.bomItems || [];
  const snapshot = est?.rates_snapshot || {};

  // Pre-fill if estimate already has values (re-editing draft)
  useEffect(() => {
    if (est) {
      if (est.labor_cost) setLaborCost(est.labor_cost);
      if (est.plating_cost) setPlatingCost(est.plating_cost);
      if (est.overhead_pct) setOverheadPct(est.overhead_pct);
    }
  }, [est]);

  // ── Live cost preview ─────────────────────────────────────────────────────
  const metalCost = est?.metal_cost ? parseFloat(est.metal_cost) : 0;
  const stoneCost = est?.stone_cost ? parseFloat(est.stone_cost) : 0;
  const labor = parseFloat(laborCost) || 0;
  const plating = parseFloat(platingCost) || 0;
  const overhead = parseFloat(overheadPct) || 0;
  const subtotal = metalCost + stoneCost + labor + plating;
  const overheadAmt = subtotal * (overhead / 100);
  const totalCost = subtotal + overheadAmt;

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (name, value) => {
    if (name === "laborCost") return value === "" ? "Labor cost is required." : isNaN(value) ? "Must be a number." : "";
    if (name === "platingCost") return value === "" ? "Plating cost is required." : isNaN(value) ? "Must be a number." : "";
    if (name === "overheadPct") return value === "" ? "Overhead % is required." : isNaN(value) || Number(value) < 0 || Number(value) > 100 ? "Enter 0–100." : "";
    return "";
  };

  const handleChange = (setter, name) => (e) => {
    setter(e.target.value);
    setErrs((p) => ({ ...p, [name]: validate(name, e.target.value) }));
  };

  const handleBlur = (name, value) => {
    setErrs((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const validateAll = () => {
    const next = {
      laborCost: validate("laborCost", laborCost),
      platingCost: validate("platingCost", platingCost),
      overheadPct: validate("overheadPct", overheadPct),
    };
    setErrs(next);
    return Object.values(next).every((e) => !e);
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;
    try {
      await createEstimate({
        estimateId: parseInt(id),
        laborCost: parseFloat(laborCost),
        platingCost: parseFloat(platingCost),
        overheadPct: parseFloat(overheadPct),
      }).unwrap();
      showSuccess("Estimate saved successfully. Sales team has been notified.", "Estimate Completed");
      navigate("/estimate-requests");
    } catch (err) {
      showError(err?.data?.message || "Something went wrong.");
    }
  };

  if (fetching) {
    return <div className="page-wrapper"><div style={{ padding: 40, textAlign: "center", color: "var(--g500)" }}>Loading estimate...</div></div>;
  }

  if (!est) {
    return <div className="page-wrapper"><div style={{ padding: 40, textAlign: "center", color: "var(--red)" }}>Estimate not found.</div></div>;
  }

  return (
    <div className="page-wrapper">

      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">Create Estimate</div>
          <div className="pg-sub">{est.style_name} · {est.client_name} · {est.quantity} pcs · Rev {est.revision_number}</div>
        </div>
        <div className="btn-row">
          <button className="btn btn-outline" onClick={() => navigate("/estimate-requests")}>← Back</button>
        </div>
      </div>

      <div className="two-col" style={{ alignItems: "flex-start" }}>

        {/* LEFT — BOM Items + Rates Snapshot */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Request Info */}
          <div className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-title">Request Details</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
              {[
                ["Style", `${est.style_name} (${est.style_code})`],
                ["Client", est.client_name],
                ["Quantity", `${est.quantity} pcs`],
                ["BOM Revision", `Rev ${est.revision_number}`],
                ["Requested By", est.requested_by_name],
                ["Requested On", formatDate(est.created_at)],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "var(--g500)", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
                </div>
              ))}
              {est.request_note && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "var(--g500)", marginBottom: 3 }}>Request Note</div>
                  <div style={{ fontSize: 13, color: "var(--g700)" }}>{est.request_note}</div>
                </div>
              )}
            </div>
          </div>

          {/* BOM Items */}
          <div className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-title">BOM Items</div>
              <div style={{ fontSize: 11, color: "var(--g500)" }}>Rates auto-fetched from sourcing</div>
            </div>

            <table className="erp-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Rate</th>
                  <th style={{ textAlign: "right" }}>Cost</th>
                </tr>
              </thead>
              <tbody>
                {bomItems.map((item) => {
                  const rate = item.current_rate ? parseFloat(item.current_rate) : 0;
                  const qty = parseFloat(item.quantity);
                  const itemCost = rate > 0 ? rate * qty : null;
                  return (
                    <tr key={item.id}>
                      <td>{materialTypeBadge(item.material_type)}</td>
                      <td style={{ fontWeight: 500 }}>{item.description}</td>
                      <td>{qty}</td>
                      <td style={{ color: "var(--g500)" }}>{item.unit}</td>
                      <td style={{ color: "var(--g700)" }}>
                        {rate > 0
                          ? fmt(rate)
                          : <span style={{ color: "var(--amber)" }}>No rate</span>
                        }
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 500 }}>
                        {itemCost != null && rate > 0
                          ? fmt(itemCost)
                          : <span style={{ color: "var(--g300)" }}>—</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Rates snapshot date */}
            {snapshot.snapshot_date && (
              <div style={{ padding: "10px 16px", fontSize: 11, color: "var(--g500)", borderTop: "1px solid var(--g200)" }}>
                📸 Rates snapshot: {snapshot.snapshot_date} — frozen at time of estimate
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Fill costs + live preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Fill Costs Form */}
          <div className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-title">Fill Costs</div>
            </div>

            <div className="info-box" style={{ marginBottom: 16 }}>
              Metal and stone costs are auto-calculated from BOM items × sourcing rates. Fill in labor, plating, and overhead below.
            </div>

            {/* Auto-calculated read-only */}
            <div style={{ background: "var(--g100)", border: "1px solid var(--g200)", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--g500)", marginBottom: 10 }}>Auto-Calculated</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
                <span>Metal Cost</span><span style={{ fontWeight: 600 }}>{fmt(metalCost)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                <span>Stone Cost</span><span style={{ fontWeight: 600 }}>{fmt(stoneCost)}</span>
              </div>
            </div>

            {/* Labor */}
            <div className="form-grp">
              <label className="form-lbl">Labor Cost ({CURRENCY_SIGN}) *</label>
              <input
                className={`form-inp ${errs.laborCost ? "inp-error" : ""}`}
                type="number"
                placeholder="e.g. 2000"
                value={laborCost}
                onChange={handleChange(setLaborCost, "laborCost")}
                onBlur={() => handleBlur("laborCost", laborCost)}
              />
              {errs.laborCost && <div className="field-err">{errs.laborCost}</div>}
            </div>

            {/* Plating */}
            <div className="form-grp">
              <label className="form-lbl">Plating Cost ({CURRENCY_SIGN}) *</label>
              <input
                className={`form-inp ${errs.platingCost ? "inp-error" : ""}`}
                type="number"
                placeholder="e.g. 400"
                value={platingCost}
                onChange={handleChange(setPlatingCost, "platingCost")}
                onBlur={() => handleBlur("platingCost", platingCost)}
              />
              {errs.platingCost && <div className="field-err">{errs.platingCost}</div>}
            </div>

            {/* Overhead */}
            <div className="form-grp">
              <label className="form-lbl">Overhead % *</label>
              <input
                className={`form-inp ${errs.overheadPct ? "inp-error" : ""}`}
                type="number"
                placeholder="e.g. 10"
                value={overheadPct}
                onChange={handleChange(setOverheadPct, "overheadPct")}
                onBlur={() => handleBlur("overheadPct", overheadPct)}
              />
              {errs.overheadPct && <div className="field-err">{errs.overheadPct}</div>}
            </div>
          </div>

          {/* Live Cost Breakdown */}
          <div className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-title">Cost Breakdown</div>
              <div style={{ fontSize: 11, color: "var(--g500)" }}>per piece</div>
            </div>

            <BreakdownRow label="Metal Cost" value={fmt(metalCost)} />
            <BreakdownRow label="Stone Cost" value={fmt(stoneCost)} />
            <BreakdownRow label="Labor Cost" value={fmt(labor)} />
            <BreakdownRow label="Plating Cost" value={fmt(plating)} />
            <BreakdownRow label={`Overhead (${overhead}%)`} value={fmt(overheadAmt)} isNote />
            <BreakdownRow label="Total Cost / Piece" value={fmt(totalCost)} isTotal />

            {est.quantity > 1 && (
              <div style={{ marginTop: 8, padding: "8px 0", borderTop: "1px solid var(--g200)", display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--g500)" }}>
                <span>Total for {est.quantity} pcs</span>
                <span style={{ fontWeight: 600, color: "var(--black)" }}>{fmt(totalCost * est.quantity)}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="form-actions" style={{ marginTop: 0 }}>
            <button className="btn btn-outline" onClick={() => navigate("/estimate-requests")}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "💾 Save Estimate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimateForm;