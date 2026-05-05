import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetBOMByIdQuery,
  useCreateBOMMutation,
  useAddBOMRevisionMutation,
  useGetAllInquiriesQuery,
} from "../../../../api/SalesAPI";
import { useGetAllAssetsQuery } from "../../../../api/RatesAPI";
import { showSuccess, showError, formatDate } from "../../../../helper/Utility";
import { useGetAllStylesQuery } from "../../../../api/RdAPI";

const UNITS = ["grams", "carats", "pcs", "job", "cm2", "meters", "ml"];
const EMPTY_ITEM = {
  assetId: "",
  materialType: "",
  description: "",
  quantity: "",
  unit: "",
  notes: "",
};

const BOM_MODES = [
  { value: "inquiry", label: "Linked to Inquiry" },
  { value: "style", label: "Style Only (No Inquiry)" },
];


const ItemRow = ({
  item,
  idx,
  onChange,
  onRemove,
  showRemove,
  isView,
  assets,
}) => {
  const handleAssetChange = (assetId) => {
    onChange(idx, "assetId", assetId);
    if (assetId) {
      const found = assets.find((a) => a.id === parseInt(assetId));
      if (found) {
        onChange(idx, "description", `${found.material_name} ${found.grade}`);
        onChange(idx, "unit", found.unit);
        const name = found.material_name.toLowerCase();
        const type =
          name.includes("diamond") ||
          name.includes("ruby") ||
          name.includes("sapphire") ||
          name.includes("pearl")
            ? "stone"
            : name.includes("gold") ||
                name.includes("silver") ||
                name.includes("platinum")
              ? "metal"
              : "other";
        onChange(idx, "materialType", type);
      }
    }
  };

  return (
    <div className="stone-row">
      <div style={{ flex: 2 }}>
        {isView ? (
          <div className="view-cell">
            {item.material_type || item.materialType}
          </div>
        ) : (
          <select
            className="form-select"
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
        )}
      </div>
      <div style={{ flex: 2 }}>
        {isView ? (
          <div className="view-cell" style={{ fontWeight: 500 }}>
            {item.description}
          </div>
        ) : (
          <input
            className="form-inp"
            placeholder="e.g. Gold 18K"
            value={item.description}
            onChange={(e) => onChange(idx, "description", e.target.value)}
          />
        )}
      </div>
      <div style={{ flex: 1 }}>
        {isView ? (
          <div className="view-cell">{parseFloat(item.quantity)}</div>
        ) : (
          <input
            className="form-inp"
            type="number"
            step="0.01"
            placeholder="1"
            value={item.quantity}
            onChange={(e) => onChange(idx, "quantity", e.target.value)}
          />
        )}
      </div>
      <div style={{ flex: 1 }}>
        {isView ? (
          <div className="view-cell">{item.unit}</div>
        ) : (
          <select
            className="form-select"
            value={item.unit}
            onChange={(e) => onChange(idx, "unit", e.target.value)}
          >
            <option value="">Unit...</option>
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        )}
      </div>
      <div style={{ flex: 2 }}>
        {isView ? (
          <div className="view-cell" style={{ color: "var(--g500)" }}>
            {item.notes || "—"}
          </div>
        ) : (
          <input
            className="form-inp"
            placeholder="Optional"
            value={item.notes}
            onChange={(e) => onChange(idx, "notes", e.target.value)}
          />
        )}
      </div>
      {!isView && (
        <div
          style={{
            width: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {showRemove && (
            <button
              type="button"
              className="btn-sm-red"
              onClick={() => onRemove(idx)}
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ── Items Table ───────────────────────────────────────────────────────────────
const ItemsTable = ({ items, isView, onChange, onRemove, assets }) => (
  <>
    <div
      className="stone-row"
      style={{
        borderBottom: "1px solid var(--g200)",
        paddingBottom: 8,
        marginBottom: 4,
      }}
    >
      <div style={{ flex: 2 }}>
        <div className="stone-header-label">Material</div>
      </div>
      <div style={{ flex: 2 }}>
        <div className="stone-header-label">Description</div>
      </div>
      <div style={{ flex: 1 }}>
        <div className="stone-header-label">Qty</div>
      </div>
      <div style={{ flex: 1 }}>
        <div className="stone-header-label">Unit</div>
      </div>
      <div style={{ flex: 2 }}>
        <div className="stone-header-label">Notes</div>
      </div>
      {!isView && <div style={{ width: 40 }} />}
    </div>
    {items.map((item, idx) => (
      <ItemRow
        key={idx}
        item={item}
        idx={idx}
        onChange={onChange}
        onRemove={onRemove}
        showRemove={items.length > 1}
        isView={isView}
        assets={assets}
      />
    ))}
  </>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const BOMForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const isViewMode = Boolean(id);

  // "inquiry" or "style"
  const [bomMode, setBomMode] = useState("inquiry");
  const [inquiryId, setInquiryId] = useState("");
  const [styleId, setStyleId] = useState("");
  const [revisionNote, setRevisionNote] = useState("");
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
  const [errs, setErrs] = useState({ source: "", revisionNote: "", items: "" });
  const [showRevForm, setShowRevForm] = useState(false);

  const {
    data: bomData,
    isLoading: fetching,
    refetch,
  } = useGetBOMByIdQuery(id, { skip: !isViewMode });
  const { data: inquiriesData } = useGetAllInquiriesQuery(
    { limit: 100 },
    { skip: isViewMode },
  );
  const { data: stylesData } = useGetAllStylesQuery(
    { status: "active" },
    { skip: isViewMode },
  );
  const { data: assetsData } = useGetAllAssetsQuery({ status: "active" });
  const [createBOM, { isLoading: saving }] = useCreateBOMMutation();
  const [addBOMRevision, { isLoading: revising }] = useAddBOMRevisionMutation();

  const bom = bomData?.data || null;
  const currentItems = bom?.currentItems || [];
  const history = bom?.revisionsHistory || [];
  const inquiries = inquiriesData?.data || [];
  const styles = stylesData?.data || [];
  const assets = assetsData?.data || [];

  // ── Validate ──────────────────────────────────────────────────────────────
  const validate = (name, value) => {
    if (name === "source") {
      if (bomMode === "inquiry") return !value ? "Inquiry is required." : "";
      if (bomMode === "style") return !value ? "Style is required." : "";
    }
    if (name === "revisionNote")
      return !value.trim() ? "Revision note is required." : "";
    if (name === "items")
      return value.some((i) => !i.assetId || !i.quantity || !i.unit)
        ? "Please select material and fill qty/unit for all items."
        : "";
    return "";
  };

  const validateAll = () => {
    const sourceVal = bomMode === "inquiry" ? inquiryId : styleId;
    const next = {
      source: isViewMode ? "" : validate("source", sourceVal),
      revisionNote: validate("revisionNote", revisionNote),
      items: validate("items", items),
    };
    setErrs(next);
    return Object.values(next).every((e) => !e);
  };

  // ── Item handlers ─────────────────────────────────────────────────────────
  const handleItemChange = (idx, field, value) =>
    setItems((p) =>
      p.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    );
  const addItem = () => setItems((p) => [...p, { ...EMPTY_ITEM }]);
  const removeItem = (idx) => setItems((p) => p.filter((_, i) => i !== idx));

  // ── Open new revision ─────────────────────────────────────────────────────
  const openRevisionForm = () => {
    setItems(
      currentItems.map((item) => ({
        assetId: item.asset_id || "",
        materialType: item.material_type,
        description: item.description,
        quantity: parseFloat(item.quantity),
        unit: item.unit,
        notes: item.notes || "",
      })),
    );
    setRevisionNote("");
    setErrs({ source: "", revisionNote: "", items: "" });
    setShowRevForm(true);
    setTimeout(
      () =>
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        }),
      100,
    );
  };

  // ── Build payload ─────────────────────────────────────────────────────────
  const buildItemsPayload = () =>
    items.map((item) => ({
      assetId: parseInt(item.assetId),
      materialType: item.materialType,
      description: item.description,
      quantity: parseFloat(item.quantity),
      unit: item.unit,
      notes: item.notes || "",
    }));

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateAll()) return;
    try {
      if (isViewMode) {
        await addBOMRevision({
          bomId: parseInt(id),
          revisionNote,
          items: buildItemsPayload(),
        }).unwrap();
        showSuccess("New revision created successfully.", "Revision Added");
        setShowRevForm(false);
        refetch();
      } else {
        // Build payload based on mode
        const payload = {
          revisionNote,
          items: buildItemsPayload(),
          ...(bomMode === "inquiry"
            ? { inquiryId: parseInt(inquiryId) }
            : { styleId: parseInt(styleId) }),
        };
        await createBOM(payload).unwrap();
        showSuccess("BOM created successfully.", "BOM Created");
        navigate("/bom");
      }
    } catch (err) {
      showError(err?.data?.message || "Something went wrong.");
    }
  };

  if (isViewMode && fetching) {
    return (
      <div className="page-wrapper">
        <div style={{ padding: 40, textAlign: "center", color: "var(--g500)" }}>
          Loading BOM...
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">
            {isViewMode ? `BOM — ${bom?.style_name || ""}` : "Create BOM"}
          </div>
          <div className="pg-sub">
            {isViewMode
              ? `${bom?.client_name} · ${bom?.style_code} · Rev ${bom?.current_revision_number}`
              : "Create a BOM linked to an inquiry, or directly for a style."}
          </div>
        </div>
        <div className="btn-row">
          {isViewMode && !showRevForm && (
            <button className="btn btn-primary" onClick={openRevisionForm}>
              ＋ New Revision
            </button>
          )}
          <button className="btn btn-outline" onClick={() => navigate("/bom")}>
            ← Back to BOMs
          </button>
        </div>
      </div>

      {/* VIEW: Current Items + History */}
      {isViewMode && (
        <>
          <div className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-title">
                Current Items
                <span className="role-badge rb-rd" style={{ marginLeft: 10 }}>
                  Rev {bom?.current_revision_number}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "var(--g500)" }}>
                {bom?.current_revision_note}
              </div>
            </div>
            {currentItems.length === 0 ? (
              <div style={{ padding: 16, color: "var(--g500)", fontSize: 13 }}>
                No items in current revision.
              </div>
            ) : (
              <ItemsTable items={currentItems} isView={true} assets={assets} />
            )}
          </div>

          <div className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-title">Revision History</div>
            </div>
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Revision</th>
                  <th>Note</th>
                  <th>Created By</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((rev) => (
                  <tr key={rev.id}>
                    <td>
                      <span className="role-badge rb-rd">
                        Rev {rev.revision_number}
                      </span>
                    </td>
                    <td style={{ color: "var(--g700)" }}>
                      {rev.revision_note || "—"}
                    </td>
                    <td style={{ color: "var(--g500)", fontSize: 12 }}>
                      {rev.created_by_name}
                    </td>
                    <td style={{ fontSize: 11.5, color: "var(--g500)" }}>
                      {formatDate(rev.created_at)}
                    </td>
                    <td>
                      {rev.is_current ? (
                        <span className="pill p-active">
                          <span className="pdot" />
                          Current
                        </span>
                      ) : (
                        <span className="pill p-inactive">
                          <span className="pdot" />
                          Superseded
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* CREATE / NEW REVISION FORM */}
      {(!isViewMode || showRevForm) && (
        <div className="form-panel">
          <div className="form-panel-header">
            <div className="form-panel-title">
              {isViewMode
                ? `New Revision (Rev ${(bom?.current_revision_number || 0) + 1})`
                : "BOM Details"}
            </div>
            {showRevForm && (
              <button
                className="btn btn-outline"
                style={{ padding: "5px 12px", fontSize: 12 }}
                onClick={() => setShowRevForm(false)}
              >
                ✕ Cancel
              </button>
            )}
          </div>

          {/* MODE SELECTOR — create mode only */}
          {!isViewMode && (
            <div className="form-grp" style={{ marginBottom: 16 }}>
              <label className="form-lbl">BOM Type</label>
              <div style={{ display: "flex", gap: 10 }}>
                {BOM_MODES.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    className={`btn ${bomMode === m.value ? "btn-primary" : "btn-outline"}`}
                    style={{ fontSize: 12, padding: "7px 16px" }}
                    onClick={() => {
                      setBomMode(m.value);
                      setInquiryId("");
                      setStyleId("");
                      setErrs((p) => ({ ...p, source: "" }));
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--g500)", marginTop: 6 }}>
                {bomMode === "inquiry"
                  ? "Inquiry-linked BOMs are tied to a specific client order and update inquiry status automatically."
                  : "Style-only BOMs are standalone — useful for costing a style before any client inquiry."}
              </div>
            </div>
          )}

          {/* SOURCE SELECTOR */}
          {!isViewMode && (
            <div className="form-grid" style={{ marginBottom: 16 }}>
              <div className="form-grp" style={{ gridColumn: "1 / -1" }}>
                {bomMode === "inquiry" ? (
                  <>
                    <label className="form-lbl">Inquiry *</label>
                    <select
                      className={`form-select ${errs.source ? "inp-error" : ""}`}
                      value={inquiryId}
                      onChange={(e) => {
                        setInquiryId(e.target.value);
                        setErrs((p) => ({
                          ...p,
                          source: validate("source", e.target.value),
                        }));
                      }}
                    >
                      <option value="">Select inquiry...</option>
                      {inquiries.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.inquiry_code} — {i.client_name} · {i.product_desc}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <label className="form-lbl">Style *</label>
                    <select
                      className={`form-select ${errs.source ? "inp-error" : ""}`}
                      value={styleId}
                      onChange={(e) => {
                        setStyleId(e.target.value);
                        setErrs((p) => ({
                          ...p,
                          source: validate("source", e.target.value),
                        }));
                      }}
                    >
                      <option value="">Select style...</option>
                      {styles.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.style_code} — {s.style_name}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                {errs.source && <div className="field-err">{errs.source}</div>}
              </div>
            </div>
          )}

          {/* Revision Note */}
          <div className="form-grp" style={{ marginBottom: 16 }}>
            <label className="form-lbl">Revision Note *</label>
            <input
              className={`form-inp ${errs.revisionNote ? "inp-error" : ""}`}
              placeholder={
                isViewMode
                  ? "e.g. Spring clasp replaced with lobster clasp"
                  : "e.g. Standard BOM for Rajesh Jewellers"
              }
              value={revisionNote}
              onChange={(e) => {
                setRevisionNote(e.target.value);
                setErrs((p) => ({
                  ...p,
                  revisionNote: validate("revisionNote", e.target.value),
                }));
              }}
            />
            {errs.revisionNote && (
              <div className="field-err">{errs.revisionNote}</div>
            )}
          </div>

          {/* Items */}
          <div className="form-panel-header" style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Items</div>
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: "5px 12px", fontSize: 12 }}
              onClick={addItem}
            >
              ＋ Add Item
            </button>
          </div>
          {errs.items && (
            <div className="field-err" style={{ marginBottom: 8 }}>
              {errs.items}
            </div>
          )}
          <ItemsTable
            items={items}
            isView={false}
            onChange={handleItemChange}
            onRemove={removeItem}
            assets={assets}
          />

          <div className="form-actions" style={{ marginTop: 16 }}>
            <button
              className="btn btn-outline"
              onClick={() =>
                isViewMode ? setShowRevForm(false) : navigate("/bom")
              }
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={saving || revising}
            >
              {saving || revising
                ? "Saving..."
                : isViewMode
                  ? "Save Revision"
                  : "Create BOM"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BOMForm;
