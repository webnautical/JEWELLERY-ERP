import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetInquiryByIdQuery,
  useCreateUpdateInquiryMutation,
  useCreateUpdateClientMutation,
  useCreateBOMMutation,
} from "../../../../api/SalesAPI";
import { useGetAllStylesQuery } from "../../../../api/RdAPI";
import { useGetAllAssetsQuery } from "../../../../api/RatesAPI";
import { showSuccess, showError, CURRENCY_SIGN, authUser } from "../../../../helper/Utility";
import { MATERIAL_OPTIONS, ORIGIN_OPTIONS, PLATING_OPTIONS, SOURCE_OPTIONS, STATUS_OPTIONS, STONE_OPTIONS, UNITS } from "../../../../helper/Constant";

const emptyDesign = () => ({
  _id: Date.now() + Math.random(),
  // Style reference
  styleId: "",
  styleName: "",
  // Sales fields (from Excel: col F, G, H, I)
  material: "",
  stone: "",
  platingThickness: "",
  images: [],
  imgPreviews: [],
  // BOM items (from Excel: col K, L, M, N — AI fills, costing adjusts)
  bomItems: [emptyBomItem()],
  revisionNote: "",
  // Inquiry-level
  quantity: "",
  targetPrice: "",
  notes: "",
  // Status
  bomStatus: "pending", // "ready" | "pending"
});

const emptyBomItem = () => ({
  _id: Date.now() + Math.random(),
  assetId: "",
  materialType: "",
  description: "",
  quantity: "",
  unit: "",
  notes: "",
});

const css = {
  // Panel
  panel: {
    background: "#fff",
    border: "1px solid var(--g200, #efefef)",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
  },
  panelHd: {
    padding: "14px 20px",
    borderBottom: "1px solid var(--g200, #efefef)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  panelTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 15,
    fontWeight: 600,
    color: "var(--black, #0f0f0f)",
  },
  panelBody: { padding: "18px 20px" },
  // Design card
  designCard: {
    border: "1px solid var(--g200, #efefef)",
    borderRadius: 8,
    marginBottom: 14,
    overflow: "hidden",
  },
  designCardActive: {
    border: "1px solid var(--blue, #2563eb)",
    borderRadius: 8,
    marginBottom: 14,
    overflow: "hidden",
  },
  designHd: {
    background: "var(--g100, #f7f7f7)",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid var(--g200, #efefef)",
  },
  designBody: { padding: "14px 16px" },
  sectionHdSales: {
    background: "#e8f0fb",
    padding: "8px 12px",
    fontSize: 11,
    fontWeight: 600,
    color: "#185fa5",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  sectionHdCosting: {
    background: "#fff8e6",
    padding: "8px 12px",
    fontSize: 11,
    fontWeight: 600,
    color: "#8a6200",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  sectionFields: {
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  // field
  formGrp: { display: "flex", flexDirection: "column", gap: 4 },
  lbl: {
    fontSize: 10.5,
    fontWeight: 600,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "var(--g700, #444)",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  inp: {
    width: "100%",
    padding: "8px 11px",
    border: "1px solid var(--g200, #efefef)",
    borderRadius: 6,
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    color: "var(--black, #0f0f0f)",
    outline: "none",
    background: "#fff",
    height: 36,
  },
  inpAI: {
    width: "100%",
    padding: "8px 11px",
    border: "1px solid #f0d080",
    borderRadius: 6,
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    color: "#8a6200",
    outline: "none",
    background: "#fff8e6",
    height: 36,
  },
  inpError: {
    borderColor: "var(--red, #d12026)",
  },
  tag: {
    display: "inline-block",
    fontSize: 9.5,
    fontWeight: 700,
    padding: "2px 6px",
    borderRadius: 3,
    letterSpacing: 0.3,
  },
  tagReq: { background: "#fde8e8", color: "#d12026" },
  tagAuto: { background: "#e6f4ee", color: "#1a7a45" },
  tagAI: { background: "#e8f0fb", color: "#185fa5" },
  tagOpt: { background: "#f0f0f0", color: "#666" },
  tagBomReady: { background: "#e6f4ee", color: "#1a7a45", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 },
  tagBomPending: { background: "#fff8e6", color: "#8a6200", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 },
  // Upload
  uploadBox: {
    border: "1.5px dashed var(--g300, #d9d9d9)",
    borderRadius: 6,
    padding: "12px 10px",
    textAlign: "center",
    fontSize: 12,
    color: "var(--g500, #8a8a8a)",
    cursor: "pointer",
    background: "var(--g100, #f7f7f7)",
  },
  imgGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  imgThumb: {
    position: "relative",
    width: 64,
    height: 64,
    borderRadius: 6,
    overflow: "hidden",
    border: "1px solid var(--g200)",
  },
  // BOM table row
  bomRow: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  // Buttons
  btnPrimary: {
    padding: "9px 20px",
    background: "var(--red, #d12026)",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 12.5,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
  },
  btnOutline: {
    padding: "9px 20px",
    background: "transparent",
    border: "1px solid var(--g300, #d9d9d9)",
    color: "var(--black, #0f0f0f)",
    borderRadius: 6,
    fontSize: 12.5,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
  },
  btnSm: {
    padding: "5px 10px",
    fontSize: 11,
    fontWeight: 500,
    borderRadius: 5,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    border: "1px solid var(--g200)",
    background: "#fff",
    color: "var(--black)",
  },
  btnSmRed: {
    padding: "5px 10px",
    fontSize: 11,
    fontWeight: 500,
    borderRadius: 5,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    border: "1px solid var(--red)",
    background: "var(--red, #d12026)",
    color: "#fff",
  },
  btnSmDanger: {
    padding: "4px 8px",
    fontSize: 11,
    borderRadius: 5,
    cursor: "pointer",
    border: "none",
    background: "transparent",
    color: "var(--red, #d12026)",
  },
  btnAddDesign: {
    width: "100%",
    padding: "11px",
    border: "1.5px dashed var(--g300, #d9d9d9)",
    borderRadius: 8,
    background: "none",
    cursor: "pointer",
    fontSize: 12.5,
    fontWeight: 500,
    color: "var(--g500, #8a8a8a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    fontFamily: "'DM Sans', sans-serif",
  },
  // Info box
  infoBox: {
    background: "#e8f0fb",
    border: "1px solid #b5d4f4",
    borderRadius: 6,
    padding: "10px 13px",
    fontSize: 12,
    color: "#185fa5",
    lineHeight: 1.5,
    marginBottom: 14,
  },
  // Error
  fieldErr: { fontSize: 11.5, color: "var(--red, #d12026)", marginTop: 3 },
  // Divider
  divider: { height: 1, background: "var(--g200, #efefef)", margin: "12px 0" },
  // Summary bar
  summaryBar: {
    background: "var(--g100, #f7f7f7)",
    border: "1px solid var(--g200)",
    borderRadius: 8,
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    flexWrap: "wrap",
    gap: 8,
  },
  numBadge: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    background: "var(--blue, #2563eb)",
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
const BOMItemRow = ({ item, idx, onChange, onRemove, showRemove, assets }) => {
  const handleAssetChange = (assetId) => {
    onChange(idx, "assetId", assetId);
    if (assetId) {
      const found = assets.find((a) => a.id === parseInt(assetId));
      if (found) {
        onChange(idx, "description", `${found.material_name} ${found.grade}`);
        onChange(idx, "unit", found.unit);
        const name = found.material_name.toLowerCase();
        const type =
          name.includes("diamond") || name.includes("ruby") || name.includes("sapphire") || name.includes("pearl")
            ? "stone"
            : name.includes("gold") || name.includes("silver") || name.includes("platinum")
              ? "metal"
              : "other";
        onChange(idx, "materialType", type);
      }
    }
  };

  return (
    <div style={css.bomRow}>
      <div style={{ flex: 2 }}>
        <select
          className="form-select"
          style={{ ...css.inp, height: 34 }}
          value={item.assetId}
          onChange={(e) => handleAssetChange(e.target.value)}
        >
          <option value="">Select material...</option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>
              {a.material_name} {a.grade} / {a.unit}
            </option>
          ))}
        </select>
      </div>
      <div style={{ flex: 2 }}>
        <input
          style={{ ...css.inp, height: 34 }}
          placeholder="e.g. Gold 18K"
          value={item.description}
          onChange={(e) => onChange(idx, "description", e.target.value)}
        />
      </div>
      <div style={{ flex: 1 }}>
        <input
          style={{ ...css.inp, height: 34 }}
          type="number"
          step="0.01"
          placeholder="Qty"
          value={item.quantity}
          onChange={(e) => onChange(idx, "quantity", e.target.value)}
        />
      </div>
      <div style={{ flex: 1 }}>
        <select
          style={{ ...css.inp, height: 34 }}
          value={item.unit}
          onChange={(e) => onChange(idx, "unit", e.target.value)}
        >
          <option value="">Unit</option>
          {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <div style={{ flex: 2 }}>
        <input
          style={{ ...css.inp, height: 34 }}
          placeholder="Notes (optional)"
          value={item.notes}
          onChange={(e) => onChange(idx, "notes", e.target.value)}
        />
      </div>
      <div style={{ width: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {showRemove && (
          <button type="button" style={css.btnSmDanger} onClick={() => onRemove(idx)}>✕</button>
        )}
      </div>
    </div>
  );
};

const DesignCard = ({
  design, idx, total,
  styles,
  onUpdate, onRemove,
}) => {
  const authUserInfo = authUser()
  const loginUserRole = authUserInfo?.role
  const imgRef = useRef();

  const set = (key, val) => onUpdate(design._id, key, val);

  // Costing field change handler
  const handleCostingChange = (key, val) => {
    set(key, val)
    // Clear error on change
    if (design._errors?.[key]) {
      set("_errors", { ...design._errors, [key]: "" })
    }
  }

  const handleCostingBlur = (key, val) => {
    const labels = {
      laborCost: "Labor cost",
      platingCost: "Plating cost",
      overheadPct: "Overhead %",
      weight: "Weight",
    }
    if (!val || isNaN(val) || Number(val) < 0) {
      set("_errors", {
        ...design._errors,
        [key]: `${labels[key]} is required.`
      })
    }
  }

  const handleStyleSelect = (styleId) => {
    set("styleId", styleId);
    if (styleId) {
      const found = styles.find((s) => s.id === parseInt(styleId));
      if (found) {
        set("styleName", `${found.style_code} — ${found.style_name}`);
        const hasBom = found.latest_bom_id || found.bom_revision_id;
        set("bomStatus", hasBom ? "ready" : "pending");
      }
    } else {
      set("styleName", "");
      set("bomStatus", "pending");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name,
      file: f,
    }));
    set("images", [...design.images, ...files]);
    set("imgPreviews", [...design.imgPreviews, ...previews]);
    e.target.value = "";
  };

  const removeImage = (i) => {
    set("images", design.images.filter((_, j) => j !== i));
    set("imgPreviews", design.imgPreviews.filter((_, j) => j !== i));
  };

  const bomReady = design.bomStatus === "ready";

  return (
    <div style={bomReady ? css.designCardActive : css.designCard}>

      {/* Design Header */}
      <div style={css.designHd}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={css.numBadge}>{idx + 1}</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            Design {idx + 1}
            {design.styleName && (
              <span style={{ fontWeight: 400, color: "var(--g500)", marginLeft: 8, fontSize: 12 }}>
                {design.styleName}
              </span>
            )}
          </span>
          <span style={bomReady ? css.tagBomReady : css.tagBomPending}>
            {bomReady ? "✓ BOM Ready" : "BOM Pending"}
          </span>
        </div>
        {total > 1 && (
          <button type="button" style={css.btnSmDanger} onClick={() => onRemove(design._id)}>
            ✕ Remove
          </button>
        )}
      </div>

      <div style={css.designBody}>

        {/* Style selector + Qty row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, marginBottom: 4 }}>
          <div style={css.formGrp}>
            <label style={css.lbl}>
              Style
              <span style={{ ...css.tag, ...css.tagOpt }}>Optional</span>
            </label>
            <select
              style={css.inp}
              value={design.styleId}
              onChange={(e) => handleStyleSelect(e.target.value)}
            >
              <option value="">Select from library or leave blank...</option>
              {styles.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.style_code} — {s.style_name}
                </option>
              ))}
            </select>
            <span style={{ fontSize: 11, color: "var(--g500)", marginTop: 2 }}>
              Select an existing style or describe manually below
            </span>
          </div>
          <div style={css.formGrp}>
            <label style={css.lbl}>
              Quantity <span style={{ ...css.tag, ...css.tagReq }}>Required</span>
            </label>
            <input
              style={{ ...css.inp, ...(design._errors?.quantity ? css.inpError : {}) }}
              type="number"
              placeholder="e.g. 50"
              value={design.quantity}
              onChange={(e) => set("quantity", e.target.value)}
            />
            {design._errors?.quantity && <span style={css.fieldErr}>{design._errors.quantity}</span>}
          </div>
          <div style={css.formGrp}>
            <label style={css.lbl}>
              Target Price
              <span style={{ ...css.tag, ...css.tagOpt }}>Optional</span>
            </label>
            <input
              style={css.inp}
              type="number"
              placeholder={`${CURRENCY_SIGN || "₹"}/pc`}
              value={design.targetPrice}
              onChange={(e) => set("targetPrice", e.target.value)}
            />
          </div>
        </div>

        <div style={css.divider} />

        {/* Two-column: Sales | Costing */}
        <div className="row">

          {/* SALES FIELDS */}
          <div className={`${loginUserRole === "costing_team" ? "col-md-6" : "col-md-12"}`}>
            <div style={css.sectionHdSales}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="8" /></svg>
              Sales fields
            </div>
            <div className="row g-3 mt-3">

              {/* Material */}
              <div className="col-md-12">
                <label style={css.lbl}>
                  Material <span style={{ ...css.tag, ...css.tagReq }}>Required</span>
                </label>
                <select
                  style={{ ...css.inp, ...(design._errors?.material ? css.inpError : {}) }}
                  value={design.material}
                  onChange={(e) => set("material", e.target.value)}
                >
                  <option value="">Select material...</option>
                  {MATERIAL_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                {design._errors?.material && <span style={css.fieldErr}>{design._errors.material}</span>}
              </div>

              {/* Stone */}
              <div className="col-md-12">
                <label style={css.lbl}>
                  Stone <span style={{ ...css.tag, ...css.tagReq }}>Required</span>
                </label>
                <select
                  style={{ ...css.inp, ...(design._errors?.stone ? css.inpError : {}) }}
                  value={design.stone}
                  onChange={(e) => set("stone", e.target.value)}
                >
                  <option value="">Select stone...</option>
                  {STONE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {design._errors?.stone && <span style={css.fieldErr}>{design._errors.stone}</span>}
              </div>

              {/* Plating Thickness */}
              <div className="col-md-12">
                <label style={css.lbl}>
                  Plating thickness <span style={{ ...css.tag, ...css.tagReq }}>Required</span>
                </label>
                <select
                  style={{ ...css.inp, ...(design._errors?.platingThickness ? css.inpError : {}) }}
                  value={design.platingThickness}
                  onChange={(e) => set("platingThickness", e.target.value)}
                >
                  <option value="">Select thickness...</option>
                  {PLATING_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {design._errors?.platingThickness && <span style={css.fieldErr}>{design._errors.platingThickness}</span>}
              </div>

              {/* Upload pics */}
              <div style={css.formGrp}>
                <label style={css.lbl}>
                  Upload pics <span style={{ ...css.tag, ...css.tagOpt }}>Optional</span>
                </label>
                <input
                  ref={imgRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                {design.imgPreviews.length === 0 ? (
                  <div style={css.uploadBox} onClick={() => imgRef.current?.click()}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>↑</div>
                    <div>Click to upload — JPG, PNG</div>
                    <div style={{ fontSize: 11, color: "var(--g300)", marginTop: 2 }}>
                      WhatsApp screenshots are also accepted
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={css.imgGrid}>
                      {design.imgPreviews.map((img, i) => (
                        <div key={i} style={css.imgThumb}>
                          <img
                            src={img.url}
                            alt={img.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            style={{
                              position: "absolute", top: 2, right: 2,
                              background: "rgba(0,0,0,0.6)", color: "#fff",
                              border: "none", borderRadius: "50%",
                              width: 16, height: 16, fontSize: 9,
                              cursor: "pointer", display: "flex",
                              alignItems: "center", justifyContent: "center",
                            }}
                          >✕</button>
                        </div>
                      ))}
                      <div
                        style={{
                          ...css.imgThumb,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", background: "var(--g100)", fontSize: 20,
                          color: "var(--g500)", border: "1.5px dashed var(--g300)",
                        }}
                        onClick={() => imgRef.current?.click()}
                      >+</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Special instructions */}
              <div style={css.formGrp}>
                <label style={css.lbl}>
                  Special instructions
                  <span style={{ ...css.tag, ...css.tagOpt }}>Optional</span>
                </label>
                <textarea
                  style={{ ...css.inp, height: 64, resize: "vertical", padding: "8px 11px" }}
                  placeholder="e.g. Extra rhodium plating, lobster clasp instead of spring..."
                  value={design.notes}
                  onChange={(e) => set("notes", e.target.value)}
                />
                <span style={{ fontSize: 11, color: "var(--g500)", marginTop: 2 }}>
                  Applicable only for this order — global BOM will not be changed
                </span>
              </div>

            </div>
          </div>

          {/* COSTING FIELDS */}
          {loginUserRole === "costing_team" && (
            <div className="col-md-6">
              <div style={css.sectionHdCosting}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="8" /></svg>
                Costing fields
                <span style={{ marginLeft: "auto", fontSize: 9.5, fontWeight: 400 }}>
                  AI generates estimates → Costing team reviews and adjusts
                </span>
              </div>
              <div style={css.sectionFields}>

                {/* Weight */}
                <div className="form-grp">
                  <label className="form-lbl">Weight (gm) *</label>
                  <input
                    className={`form-inp ${design._errors?.weight ? "inp-error" : ""}`}
                    type="number"
                    placeholder="e.g. 5.5"
                    step="0.01"
                    value={design.weight || ""}
                    onChange={(e) => handleCostingChange("weight", e.target.value)}
                    onBlur={(e) => handleCostingBlur("weight", e.target.value)}
                  />
                  {design._errors?.weight && <div className="field-err">{design._errors.weight}</div>}
                </div>

                {/* Labor Cost */}
                <div className="form-grp">
                  <label className="form-lbl">Labor Cost ({CURRENCY_SIGN}) *</label>
                  <input
                    className={`form-inp ${design._errors?.laborCost ? "inp-error" : ""}`}
                    type="number"
                    placeholder="e.g. 2000"
                    value={design.laborCost || ""}
                    onChange={(e) => handleCostingChange("laborCost", e.target.value)}
                    onBlur={(e) => handleCostingBlur("laborCost", e.target.value)}
                  />
                  {design._errors?.laborCost && <div className="field-err">{design._errors.laborCost}</div>}
                </div>

                {/* Plating Cost */}
                <div className="form-grp">
                  <label className="form-lbl">Plating Cost ({CURRENCY_SIGN}) *</label>
                  <input
                    className={`form-inp ${design._errors?.platingCost ? "inp-error" : ""}`}
                    type="number"
                    placeholder="e.g. 400"
                    value={design.platingCost || ""}
                    onChange={(e) => handleCostingChange("platingCost", e.target.value)}
                    onBlur={(e) => handleCostingBlur("platingCost", e.target.value)}
                  />
                  {design._errors?.platingCost && <div className="field-err">{design._errors.platingCost}</div>}
                </div>

                {/* Overhead % */}
                <div className="form-grp">
                  <label className="form-lbl">Overhead % *</label>
                  <input
                    className={`form-inp ${design._errors?.overheadPct ? "inp-error" : ""}`}
                    type="number"
                    placeholder="e.g. 10"
                    value={design.overheadPct || ""}
                    onChange={(e) => handleCostingChange("overheadPct", e.target.value)}
                    onBlur={(e) => handleCostingBlur("overheadPct", e.target.value)}
                  />
                  {design._errors?.overheadPct && <div className="field-err">{design._errors.overheadPct}</div>}
                </div>

                <div style={{
                  marginTop: 6, padding: "8px 10px",
                  background: "var(--g100)", borderRadius: 6,
                  fontSize: 11, color: "var(--g500)", lineHeight: 1.5,
                }}>
                  The costing team can export to Excel, make adjustments, and re-import to finalize
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
const InquiryForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const isEdit = Boolean(id);

  // ── Client ────────────────────────────────────────────────────────────────
  const [client, setClient] = useState({
    clientName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [clientErrs, setClientErrs] = useState({
    clientName: "", email: "", phone: "",
  });

  // ── Inquiry-level ─────────────────────────────────────────────────────────
  const [inquiryMeta, setInquiryMeta] = useState({
    source: "",
    requiredDelivery: "",
    status: "new",
    assignedTo: "",
  });

  // ── Designs (multi-style) ─────────────────────────────────────────────────
  const [designs, setDesigns] = useState([emptyDesign()]);

  // ── API ───────────────────────────────────────────────────────────────────
  const { data: inquiryData, isLoading: fetching } = useGetInquiryByIdQuery(id, { skip: !isEdit });
  const { data: stylesData } = useGetAllStylesQuery({ status: "active" });
  const { data: assetsData } = useGetAllAssetsQuery({ status: "active" });

  const [createUpdateInquiry, { isLoading: savingInquiry }] = useCreateUpdateInquiryMutation();
  const [createUpdateClient, { isLoading: savingClient }] = useCreateUpdateClientMutation();
  const [createBOM, { isLoading: savingBOM }] = useCreateBOMMutation();

  const styles = stylesData?.data || [];
  const assets = assetsData?.data || [];
  const saving = savingInquiry || savingClient || savingBOM;

  // ── Populate on Edit ──────────────────────────────────────────────────────
  useEffect(() => {
    if (inquiryData?.data) {
      const d = inquiryData.data;
      setClient({
        clientName: d.client_name || "",
        email: d.client_email || "",
        phone: d.client_phone || "",
        address: d.client_address || "",
      });
      setInquiryMeta({
        source: d.source || "",
        requiredDelivery: d.required_delivery ? d.required_delivery.split("T")[0] : "",
        status: d.status || "new",
        assignedTo: d.assigned_to || "",
      });
      // For edit mode, load existing designs — adapt as per your API shape
      if (d.designs?.length) {
        setDesigns(
          d.designs.map((des) => ({
            ...emptyDesign(),
            styleId: des.style_id || "",
            styleName: des.style_name || "",
            material: des.material || "",
            stone: des.stone || "",
            platingThickness: des.plating_thickness || "",
            quantity: des.quantity || "",
            targetPrice: des.target_price || "",
            notes: des.notes || "",
            revisionNote: des.revision_note || "",
            bomStatus: des.bom_status || "pending",
            bomItems: des.bom_items?.length
              ? des.bom_items.map((bi) => ({
                _id: Math.random(),
                assetId: bi.asset_id || "",
                materialType: bi.material_type || "",
                description: bi.description || "",
                quantity: bi.quantity || "",
                unit: bi.unit || "",
                notes: bi.notes || "",
              }))
              : [emptyBomItem()],
          }))
        );
      }
    }
  }, [inquiryData]);

  // ── Client validation ─────────────────────────────────────────────────────
  const isValidEmail = (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isValidPhone = (v) => !v || /^[0-9+\s\-()]{7,15}$/.test(v);

  const validateClientField = (name, value) => {
    if (name === "clientName") return !value.trim() ? "Client name is required." : "";
    if (name === "email") return !isValidEmail(value) ? "Enter a valid email address." : "";
    if (name === "phone") return !isValidPhone(value) ? "Enter a valid phone number." : "";
    return "";
  };

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClient((p) => ({ ...p, [name]: value }));
    setClientErrs((p) => ({ ...p, [name]: validateClientField(name, value) }));
  };

  const validateAllClient = () => {
    const next = {
      clientName: validateClientField("clientName", client.clientName),
      email: validateClientField("email", client.email),
      phone: validateClientField("phone", client.phone),
    };
    setClientErrs(next);
    return Object.values(next).every((e) => !e);
  };

  // ── Design update/remove ──────────────────────────────────────────────────
  const updateDesign = (_id, key, val) => {
    setDesigns((prev) =>
      prev.map((d) => d._id === _id ? { ...d, [key]: val } : d)
    );
  };

  const addDesign = () => {
    setDesigns((prev) => [...prev, emptyDesign()]);
  };

  const removeDesign = (_id) => {
    setDesigns((prev) => prev.filter((d) => d._id !== _id));
  };

  // ── Validate all designs ──────────────────────────────────────────────────
  const validateAllDesigns = () => {
    let valid = true;
    const updated = designs.map((d) => {
      const errors = {};
      if (!d.quantity || isNaN(d.quantity) || Number(d.quantity) <= 0)
        errors.quantity = "Quantity required.";
      if (!d.material)
        errors.material = "Material required.";
      if (!d.stone)
        errors.stone = "Stone required.";
      if (!d.platingThickness)
        errors.platingThickness = "Plating thickness required.";
      if (!d.revisionNote?.trim())
        errors.revisionNote = "Revision note required.";
      if (d.bomItems.some((i) => !i.assetId || !i.quantity || !i.unit))
        errors.bomItems = "Fill material, qty and unit for all BOM rows.";
      if (Object.keys(errors).length) valid = false;
      return { ...d, _errors: errors };
    });
    setDesigns(updated);
    return valid;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const clientOk = validateAllClient();
    const designsOk = validateAllDesigns();
    // if (!clientOk || !designsOk) return;

    const payload = {
      clientOk: clientOk,
      designsOk: designsOk,
      clientPayload: client,
      Inquiry: designs,
    }

    console.log("payload", payload)
    return false;

    try {
      // Step 1 — Save client
      const clientPayload = isEdit
        ? { id: inquiryData?.data?.client_id, ...client }
        : client;
      const clientRes = await createUpdateClient(clientPayload).unwrap();
      const clientId = clientRes?.data?.id || clientRes?.id;

      // Step 2 — Save each design as a separate inquiry + BOM
      for (const design of designs) {
        const formData = new FormData();
        if (isEdit) formData.append("id", id);
        formData.append("clientId", parseInt(clientId));
        if (design.styleId) formData.append("styleId", parseInt(design.styleId));
        if (inquiryMeta.assignedTo) formData.append("assignedTo", parseInt(inquiryMeta.assignedTo));

        // Excel fields
        formData.append("material", design.material);
        formData.append("stone", design.stone);
        formData.append("platingThickness", design.platingThickness);
        formData.append("quantity", parseInt(design.quantity));
        if (design.targetPrice) formData.append("targetPrice", parseFloat(design.targetPrice));
        if (inquiryMeta.requiredDelivery) formData.append("requiredDelivery", inquiryMeta.requiredDelivery);
        if (inquiryMeta.source) formData.append("source", inquiryMeta.source);
        if (design.notes) formData.append("notes", design.notes);
        formData.append("status", inquiryMeta.status);
        design.images.forEach((f) => formData.append("designs", f));

        const inquiryRes = await createUpdateInquiry(formData).unwrap();
        const inquiryId = inquiryRes?.data?.id || inquiryRes?.id;

        // Step 3 — Save BOM for this design
        await createBOM({
          inquiryId: parseInt(inquiryId),
          revisionNote: design.revisionNote,
          items: design.bomItems.map((item) => ({
            assetId: parseInt(item.assetId),
            materialType: item.materialType,
            description: item.description,
            quantity: parseFloat(item.quantity),
            unit: item.unit,
            notes: item.notes || "",
          })),
        }).unwrap();
      }

      showSuccess(
        isEdit ? "Inquiry updated successfully." : "Inquiry created successfully.",
        isEdit ? "Updated" : "Created",
      );
      navigate("/inquiries");
    } catch (err) {
      showError(err?.data?.message || "Something went wrong.");
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isEdit && fetching) {
    return (
      <div className="page-wrapper">
        <div style={{ padding: 40, textAlign: "center", color: "var(--g500)" }}>
          Loading inquiry...
        </div>
      </div>
    );
  }

  // ── Summary counts ────────────────────────────────────────────────────────
  const totalQty = designs.reduce((s, d) => s + (Number(d.quantity) || 0), 0);
  const bomReadyCnt = designs.filter((d) => d.bomStatus === "ready").length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="page-wrapper">

      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">{isEdit ? "Edit Inquiry" : "New Inquiry"}</div>
          <div className="pg-sub">
            {isEdit
              ? "Update client, styles and BOM details."
              : "Create a client inquiry and add multiple designs together"}
          </div>
        </div>
        <div className="btn-row">
          <button style={css.btnOutline} onClick={() => navigate("/inquiries")}>
            ← Back
          </button>
        </div>
      </div>

      {/* ════════════════════════════
          SECTION 1 — CLIENT DETAILS
      ════════════════════════════ */}
      <div style={css.panel}>
        <div style={css.panelHd}>
          <div style={css.panelTitle}>Client details</div>
        </div>
        <div style={css.panelBody}>
          <div className="row g-3">

            <div className="col-md-4 col-12">
              <div style={css.formGrp}>
                <label style={css.lbl}>
                  Client name <span style={{ ...css.tag, ...css.tagReq }}>Required</span>
                </label>
                <input
                  style={{ ...css.inp, ...(clientErrs.clientName ? css.inpError : {}) }}
                  name="clientName"
                  placeholder="e.g. Rajesh Jewellers"
                  value={client.clientName}
                  onChange={handleClientChange}
                />
                {clientErrs.clientName && <span style={css.fieldErr}>{clientErrs.clientName}</span>}
              </div>
            </div>

            <div className="col-md-4 col-12">
              <div style={css.formGrp}>
                <label style={css.lbl}>
                  Email <span style={{ ...css.tag, ...css.tagOpt }}>Optional</span>
                </label>
                <input
                  style={{ ...css.inp, ...(clientErrs.email ? css.inpError : {}) }}
                  name="email"
                  type="email"
                  placeholder="client@example.com"
                  value={client.email}
                  onChange={handleClientChange}
                />
                {clientErrs.email && <span style={css.fieldErr}>{clientErrs.email}</span>}
              </div>
            </div>

            <div className="col-md-4 col-12">
              <div style={css.formGrp}>
                <label style={css.lbl}>
                  Phone <span style={{ ...css.tag, ...css.tagOpt }}>Optional</span>
                </label>
                <input
                  style={{ ...css.inp, ...(clientErrs.phone ? css.inpError : {}) }}
                  name="phone"
                  placeholder="e.g. 9810000000"
                  value={client.phone}
                  onChange={handleClientChange}
                />
                {clientErrs.phone && <span style={css.fieldErr}>{clientErrs.phone}</span>}
              </div>
            </div>

            <div className="col-12">
              <div style={css.formGrp}>
                <label style={css.lbl}>Address</label>
                <textarea
                  style={{ ...css.inp, height: 70, resize: "vertical", padding: "8px 11px" }}
                  name="address"
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={client.address}
                  onChange={handleClientChange}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ════════════════════════════
          SECTION 2 — INQUIRY META
      ════════════════════════════ */}
      <div style={css.panel}>
        <div style={css.panelHd}>
          <div style={css.panelTitle}>Inquiry details</div>
        </div>
        <div style={css.panelBody}>
          <div className="row g-3">

            <div className="col-md-4 col-12">
              <div style={css.formGrp}>
                <label style={css.lbl}>
                  Source channel <span style={{ ...css.tag, ...css.tagReq }}>Required</span>
                </label>
                <select
                  style={css.inp}
                  value={inquiryMeta.source}
                  onChange={(e) => setInquiryMeta((p) => ({ ...p, source: e.target.value }))}
                >
                  <option value="">Select source...</option>
                  {SOURCE_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-4 col-12">
              <div style={css.formGrp}>
                <label style={css.lbl}>
                  Expected delivery <span style={{ ...css.tag, ...css.tagOpt }}>Optional</span>
                </label>
                <input
                  style={css.inp}
                  type="date"
                  value={inquiryMeta.requiredDelivery}
                  onChange={(e) => setInquiryMeta((p) => ({ ...p, requiredDelivery: e.target.value }))}
                />
              </div>
            </div>

            {isEdit && (
              <div className="col-md-4 col-12">
                <div style={css.formGrp}>
                  <label style={css.lbl}>Status</label>
                  <select
                    style={css.inp}
                    value={inquiryMeta.status}
                    onChange={(e) => setInquiryMeta((p) => ({ ...p, status: e.target.value }))}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ════════════════════════════
          SECTION 3 — DESIGNS + BOM
      ════════════════════════════ */}
      <div style={css.panel}>
        <div style={css.panelHd}>
          <div style={css.panelTitle}>
            Designs &amp; BOM
            <span style={{
              marginLeft: 10, fontSize: 12, fontWeight: 400,
              color: "var(--g500)",
            }}>
              — each inquiry can contain multiple designs
            </span>
          </div>
          <span style={{ fontSize: 12, color: "var(--g500)" }}>
            {designs.length} design{designs.length !== 1 ? "s" : ""} added
          </span>
        </div>
        <div style={css.panelBody}>

          {/* AI info banner */}
          <div style={css.infoBox}>
            ℹ️ <strong>AI workflow:</strong> Fill in Material, Stone, Plating Thickness, and Upload Images.
            AI will automatically estimate BOM items. The costing team can export to Excel, make adjustments, and re-import to finalize.
          </div>
          {/* Design cards */}
          {designs.map((design, idx) => (
            <DesignCard
              key={design._id}
              design={design}
              idx={idx}
              total={designs.length}
              styles={styles}
              assets={assets}
              onUpdate={updateDesign}
              onRemove={removeDesign}
              isEdit={isEdit}
            />
          ))}

          {/* Add design button */}
          <button type="button" style={css.btnAddDesign} onClick={addDesign}>
            ＋ Add another design
          </button>

          {/* Summary bar */}
          {designs.length > 0 && (
            <div style={css.summaryBar}>
              <div style={{ fontSize: 12, color: "var(--g700)" }}>
                <strong>{designs.length}</strong> design{designs.length !== 1 ? "s" : ""}
                &nbsp;·&nbsp;
                <strong>{totalQty}</strong> total pcs
                &nbsp;·&nbsp;
                <span style={{ color: bomReadyCnt === designs.length ? "#1a7a45" : "#8a6200" }}>
                  {bomReadyCnt}/{designs.length} BOM ready
                </span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* FORM ACTIONS */}
      <div className="form-actions" style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
        <button style={css.btnOutline} onClick={() => navigate("/inquiries")}>
          Cancel
        </button>
        <button style={css.btnPrimary} onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update Inquiry" : "Create Inquiry"}
        </button>
      </div>

    </div>
  );
};

export default InquiryForm;