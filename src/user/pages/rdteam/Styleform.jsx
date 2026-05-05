import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { showSuccess, showError, imgBaseURL } from "../../../../helper/Utility";

import {
  useCreateUpdateStyleMutation,
  useGetStyleByIdQuery,
} from "../../../api/RdAPI";
import { showSuccess, showError, imgBaseURL } from "../../../helper/Utility";

const ORIGIN_OPTIONS = [
  { value: "in_house", label: "In-House" },
  { value: "client_design", label: "Client Design" },
  { value: "market_sample", label: "Market Sample" },
];

const METAL_TYPES = [
  "Gold 18K",
  "Gold 22K",
  "Silver 925",
  "Platinum",
  "White Gold 18K",
  "Rose Gold 18K",
];
const PLATING = ["Rhodium", "Gold", "Rose Gold", "Silver", "None"];

const INIT = {
  styleName: "",
  metalType: "",
  metalWeight: "",
  plating: "",
  origin: "",
  description: "",
  stoneDetails: [{ type: "", qty: "", unit: "carats", amount: "" }],
  cadDimensions: { length: "", width: "", surface_area: "" },
};

const INIT_ERRS = {
  styleName: "",
  metalType: "",
  metalWeight: "",
  origin: "",
};

// ── Stone detail row component ────────────────────────────────────────────────
const StoneRow = ({ stone, idx, onChange, onRemove, showRemove }) => (
  <div className="stone-row">
    <div className="form-grp" style={{ flex: 2 }}>
      {idx === 0 && <label className="form-lbl">Stone Type</label>}
      <input
        className="form-inp"
        placeholder="e.g. Diamond"
        value={stone.type}
        onChange={(e) => onChange(idx, "type", e.target.value)}
      />
    </div>
    <div className="form-grp" style={{ flex: 1 }}>
      {idx === 0 && <label className="form-lbl">Qty</label>}
      <input
        className="form-inp"
        type="number"
        placeholder="1"
        value={stone.qty}
        onChange={(e) => onChange(idx, "qty", e.target.value)}
      />
    </div>
    <div className="form-grp" style={{ flex: 1 }}>
      {idx === 0 && <label className="form-lbl">Unit</label>}
      <select
        className="form-select"
        value={stone.unit}
        onChange={(e) => onChange(idx, "unit", e.target.value)}
      >
        <option value="carats">Carats</option>
        <option value="pcs">Pcs</option>
        <option value="grams">Grams</option>
      </select>
    </div>
    <div className="form-grp" style={{ flex: 1 }}>
      {idx === 0 && <label className="form-lbl">Amount</label>}
      <input
        className="form-inp"
        type="number"
        placeholder="0.5"
        value={stone.amount}
        onChange={(e) => onChange(idx, "amount", e.target.value)}
      />
    </div>
    {showRemove && (
      <button
        type="button"
        className="btn-sm-red"
        style={{
          alignSelf: idx === 0 ? "flex-end" : "center",
          marginBottom: idx === 0 ? 0 : 0,
          flexShrink: 0,
        }}
        onClick={() => onRemove(idx)}
      >
        ✕
      </button>
    )}
  </div>
);

const StyleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(INIT);
  const [errs, setErrs] = useState(INIT_ERRS);
  const [images, setImages] = useState([]); // new File objects
  const [cadFiles, setCadFiles] = useState([]); // new File objects
  const [imgPreview, setImgPreview] = useState([]); // {url, isExisting}
  const [cadPreview, setCadPreview] = useState([]); // {name, isExisting}

  const imgRef = useRef();
  const cadRef = useRef();

  const [removedImages, setRemovedImages] = useState([]);
  const [removedCadFiles, setRemovedCadFiles] = useState([]);

  const { data: styleData, isLoading: fetching } = useGetStyleByIdQuery(id, {
    skip: !isEdit,
  });
  const [createUpdateStyle, { isLoading: saving }] =
    useCreateUpdateStyleMutation();

  // ── Prefill on edit ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (styleData?.data) {
      const s = styleData.data;
      setForm({
        styleName: s.style_name || "",
        metalType: s.metal_type || "",
        metalWeight: s.metal_weight || "",
        plating: s.plating || "",
        origin: s.origin || "",
        description: s.description || "",
        stoneDetails: s.stone_details?.length
          ? s.stone_details
          : [{ type: "", qty: "", unit: "carats", amount: "" }],
        cadDimensions: s.cad_dimensions || {
          length: "",
          width: "",
          surface_area: "",
        },
      });
      // existing images preview
      if (s.images?.length) {
        setImgPreview(
          s.images.map((img) => ({
            url: `${imgBaseURL()}/${img}`,
            name: img,
            isExisting: true,
          })),
        );
      }
      // existing cad files preview
      if (s.cad_files?.length) {
        // setCadPreview(
        //   s.cad_files.map((f) => ({
        //     name: f.split("/").pop(),
        //     isExisting: true,
        //   })),
        // );
        setCadPreview(
          s.cad_files.map((f) => ({
            name: typeof f === "string" ? f.split("/").pop() : f,
            originalPath: f, // full DB path — sent back to backend for removal
            isExisting: true,
          })),
        );
      }
    }
  }, [styleData]);

  // ── Field helpers ────────────────────────────────────────────────────────────
  const validate = (name, value) => {
    switch (name) {
      case "styleName":
        return !value.trim() ? "Style name is required." : "";
      case "metalType":
        return !value ? "Metal type is required." : "";
      case "metalWeight":
        return !value
          ? "Metal weight is required."
          : isNaN(value)
            ? "Must be a valid number."
            : "";
      case "origin":
        return !value ? "Origin is required." : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errs[name] !== undefined)
      setErrs((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (errs[name] !== undefined)
      setErrs((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleDimChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      cadDimensions: { ...p.cadDimensions, [name]: value },
    }));
  };

  // ── Stone handlers ────────────────────────────────────────────────────────────
  const handleStoneChange = (idx, field, value) => {
    const updated = form.stoneDetails.map((s, i) =>
      i === idx ? { ...s, [field]: value } : s,
    );
    setForm((p) => ({ ...p, stoneDetails: updated }));
  };

  const addStone = () =>
    setForm((p) => ({
      ...p,
      stoneDetails: [
        ...p.stoneDetails,
        { type: "", qty: "", unit: "carats", amount: "" },
      ],
    }));
  const removeStone = (idx) =>
    setForm((p) => ({
      ...p,
      stoneDetails: p.stoneDetails.filter((_, i) => i !== idx),
    }));

  // ── Image handlers ────────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((p) => [...p, ...files]);
    const previews = files.map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name,
      isExisting: false,
    }));
    setImgPreview((p) => [...p, ...previews]);
    e.target.value = "";
  };

  // AFTER
  const removeImage = (idx) => {
    const item = imgPreview[idx];
    if (item.isExisting) {
      // track original path for removal — name holds the original DB path
      setRemovedImages((p) => [...p, item.name]);
    } else {
      const newIdx = imgPreview
        .slice(0, idx)
        .filter((i) => !i.isExisting).length;
      setImages((p) => p.filter((_, i) => i !== newIdx));
    }
    setImgPreview((p) => p.filter((_, i) => i !== idx));
  };

  // ── CAD handlers ──────────────────────────────────────────────────────────────
  const handleCadChange = (e) => {
    const files = Array.from(e.target.files);
    setCadFiles((p) => [...p, ...files]);
    setCadPreview((p) => [
      ...p,
      ...files.map((f) => ({ name: f.name, isExisting: false })),
    ]);
    e.target.value = "";
  };

  const removeCad = (idx) => {
    const item = cadPreview[idx];
    if (item.isExisting) {
      // track original path for removal — name holds the original DB path
      setRemovedCadFiles((p) => [...p, item.originalPath]);
    } else {
      const newIdx = cadPreview
        .slice(0, idx)
        .filter((i) => !i.isExisting).length;
      setCadFiles((p) => p.filter((_, i) => i !== newIdx));
    }
    setCadPreview((p) => p.filter((_, i) => i !== idx));
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const validateAll = () => {
    const next = {
      styleName: validate("styleName", form.styleName),
      metalType: validate("metalType", form.metalType),
      metalWeight: validate("metalWeight", form.metalWeight),
      origin: validate("origin", form.origin),
    };
    setErrs(next);
    return Object.values(next).every((e) => !e);
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;

    const fd = new FormData();
    if (isEdit) fd.append("id", id);
    fd.append("styleName", form.styleName);
    fd.append("metalType", form.metalType);
    fd.append("metalWeight", form.metalWeight);
    fd.append("plating", form.plating);
    fd.append("origin", form.origin);
    fd.append("description", form.description);
    fd.append(
      "stoneDetails",
      JSON.stringify(form.stoneDetails.filter((s) => s.type)),
    );
    fd.append("cadDimensions", JSON.stringify(form.cadDimensions));
    if (isEdit && removedImages.length)
      fd.append("removedImages", JSON.stringify(removedImages));
    if (isEdit && removedCadFiles.length)
      fd.append("removedCadFiles", JSON.stringify(removedCadFiles));
    images.forEach((f) => fd.append("images", f));
    cadFiles.forEach((f) => fd.append("cadFiles", f));

    try {
      await createUpdateStyle(fd).unwrap();
      showSuccess(
        isEdit ? "Style updated successfully." : "Style created successfully.",
        isEdit ? "Updated" : "Created",
      );
      navigate("/styles");
    } catch (err) {
      showError(err?.data?.message || "Something went wrong.");
    }
  };

  if (isEdit && fetching) {
    return (
      <div className="page-wrapper">
        <div style={{ padding: 40, textAlign: "center", color: "var(--g500)" }}>
          Loading style...
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
            {isEdit ? "Edit Style" : "Add New Style"}
          </div>
          <div className="pg-sub">
            {isEdit
              ? `Editing: ${form.styleName}`
              : "Create a new jewelry style with materials, stones, and design files."}
          </div>
        </div>
        <div className="btn-row">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/styles")}
          >
            ← Back to Styles
          </button>
        </div>
      </div>

      {/* ── BASIC DETAILS ── */}
      <div className="form-panel">
        <div className="form-panel-header">
          <div className="form-panel-title">Basic Details</div>
        </div>

        <div className="form-grid">
          <div className="form-grp">
            <label className="form-lbl">Style Name *</label>
            <input
              className={`form-inp ${errs.styleName ? "inp-error" : ""}`}
              name="styleName"
              placeholder="e.g. Solitaire Ring 18K"
              value={form.styleName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errs.styleName && (
              <div className="field-err">{errs.styleName}</div>
            )}
          </div>

          <div className="form-grp">
            <label className="form-lbl">Origin *</label>
            <select
              className={`form-select ${errs.origin ? "inp-error" : ""}`}
              name="origin"
              value={form.origin}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select origin...</option>
              {ORIGIN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errs.origin && <div className="field-err">{errs.origin}</div>}
          </div>

          <div className="form-grp">
            <label className="form-lbl">Metal Type *</label>
            <select
              className={`form-select ${errs.metalType ? "inp-error" : ""}`}
              name="metalType"
              value={form.metalType}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select metal...</option>
              {METAL_TYPES.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            {errs.metalType && (
              <div className="field-err">{errs.metalType}</div>
            )}
          </div>

          <div className="form-grp">
            <label className="form-lbl">Metal Weight (grams) *</label>
            <input
              className={`form-inp ${errs.metalWeight ? "inp-error" : ""}`}
              name="metalWeight"
              type="number"
              step="0.01"
              placeholder="e.g. 4.2"
              value={form.metalWeight}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errs.metalWeight && (
              <div className="field-err">{errs.metalWeight}</div>
            )}
          </div>

          <div className="form-grp">
            <label className="form-lbl">Plating</label>
            <select
              className="form-select"
              name="plating"
              value={form.plating}
              onChange={handleChange}
            >
              <option value="">Select plating...</option>
              {PLATING.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="form-grp" style={{ gridColumn: "1 / -1" }}>
            <label className="form-lbl">Description</label>
            <textarea
              className="form-inp"
              name="description"
              rows={3}
              placeholder="Brief description of this style..."
              value={form.description}
              onChange={handleChange}
              style={{ resize: "vertical" }}
            />
          </div>
        </div>
      </div>

      {/* ── STONE DETAILS ── */}
      <div className="form-panel">
        <div className="form-panel-header">
          <div className="form-panel-title">Stone Details</div>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: "5px 12px", fontSize: 12 }}
            onClick={addStone}
          >
            ＋ Add Stone
          </button>
        </div>

        {form.stoneDetails.map((stone, idx) => (
          <StoneRow
            key={idx}
            stone={stone}
            idx={idx}
            onChange={handleStoneChange}
            onRemove={removeStone}
            showRemove={form.stoneDetails.length > 1}
          />
        ))}
      </div>

      {/* ── CAD DIMENSIONS ── */}
      <div className="form-panel">
        <div className="form-panel-header">
          <div className="form-panel-title">CAD Dimensions</div>
        </div>
        <div
          className="form-grid"
          style={{ gridTemplateColumns: "repeat(3,1fr)" }}
        >
          <div className="form-grp">
            <label className="form-lbl">Length (mm)</label>
            <input
              className="form-inp"
              name="length"
              type="number"
              placeholder="20"
              value={form.cadDimensions.length}
              onChange={handleDimChange}
            />
          </div>
          <div className="form-grp">
            <label className="form-lbl">Width (mm)</label>
            <input
              className="form-inp"
              name="width"
              type="number"
              placeholder="18"
              value={form.cadDimensions.width}
              onChange={handleDimChange}
            />
          </div>
          <div className="form-grp">
            <label className="form-lbl">Surface Area (cm²)</label>
            <input
              className="form-inp"
              name="surface_area"
              type="number"
              step="0.01"
              placeholder="8.4"
              value={form.cadDimensions.surface_area}
              onChange={handleDimChange}
            />
          </div>
        </div>
      </div>

      {/* ── IMAGES ── */}
      <div className="form-panel">
        <div className="form-panel-header">
          <div className="form-panel-title">Style Images</div>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: "5px 12px", fontSize: 12 }}
            onClick={() => imgRef.current.click()}
          >
            ＋ Add Images
          </button>
        </div>
        <input
          ref={imgRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        {imgPreview.length > 0 ? (
          <div className="img-preview-grid">
            {imgPreview.map((img, idx) => (
              <div key={idx} className="img-preview-item">
                <img src={img.url} alt={img.name} />
                <button
                  type="button"
                  className="img-remove-btn"
                  onClick={() => removeImage(idx)}
                >
                  ✕
                </button>
                {img.isExisting && (
                  <div className="img-existing-tag">Saved</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            className="upload-placeholder"
            onClick={() => imgRef.current.click()}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>
               <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 512 512"
    >
      <g>
        <path
          d="M347.92 260.66q-7.85 34.13-15.68 68.2c-1.93 8.45-3.7 16.93-5.66 25.37-4.26 18.34-19.22 32.13-38.11 32.91-21.76.89-43.62.91-65.38 0-19-.83-33.78-15.33-37.88-34-6.55-29.72-13.46-59.37-20.24-89a37.88 37.88 0 0 0-1.49-4.11c-10.89 0-21.77-.16-32.65 0-13 .25-23.19-4.3-28.63-16.56-5.56-12.53-2.87-23.86 6.36-33.79l93.17-100.24c10.91-11.74 21.77-23.51 32.72-35.21 13.14-14 29.93-14.2 43-.14q62.81 67.39 125.43 135c11.23 12.11 12.87 26.92 4.54 38.9-5.62 8.08-13.58 11.9-23.34 12-11.57.11-23.13.13-34.7.19a8.91 8.91 0 0 0-1.46.48zm37.14-29.18L255.1 91.9 129 229.51l.79 1.83c13.53 0 27.05-.16 40.58 0 13.71.2 17 3.11 20.06 16.35q11.22 49.06 22.48 98.11c2.15 9.36 6.73 13.12 16.37 13.16q26.71.11 53.42 0c9.83 0 14.13-3.51 16.34-13.08 7.62-33.13 15.16-66.29 22.82-99.41 2.79-12.06 6.62-15 19-15 14.01-.01 28 .01 44.2.01z"
          fill="#d12026"
        />
        <path
          d="M256 448.37h-82.75c-43-.08-73.48-30.34-73.86-73.35-.07-8.45-.14-16.91 0-25.36.19-9.36 5.75-15.11 14.19-15.06 8.29.05 14 6.07 14.1 15.27.14 8.67 0 17.35 0 26 .19 24.85 17.64 43.7 42.42 43.91q85.74.71 171.5 0c24.77-.2 42.28-19 42.49-43.86.07-8.67-.09-17.35 0-26 .14-9.26 5.73-15.24 14-15.32s14.29 5.68 14.21 15c-.12 13.76.72 27.78-1.57 41.22-5.64 33.14-34.53 56.76-68.16 57.52h-2z"
          fill="#d12026"
        />
      </g>
    </svg>
            </div>
            <div style={{ fontSize: 13, color: "var(--g500)" }}>
              Click to upload style images
            </div>
            <div style={{ fontSize: 11, color: "var(--g300)", marginTop: 4 }}>
              JPG, PNG supported
            </div>
          </div>
        )}
      </div>

      {/* ── CAD FILES ── */}
      <div className="form-panel">
        <div className="form-panel-header">
          <div className="form-panel-title">CAD Files</div>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: "5px 12px", fontSize: 12 }}
            onClick={() => cadRef.current.click()}
          >
            ＋ Add CAD Files
          </button>
        </div>
        <input
          ref={cadRef}
          type="file"
          accept=".dwg,.dxf,.stl,.obj,.step,.stp"
          multiple
          style={{ display: "none" }}
          onChange={handleCadChange}
        />

        {cadPreview.length > 0 ? (
          <div className="cad-file-list">
            {cadPreview.map((f, idx) => (
              <div key={idx} className="cad-file-item">
                <span style={{ fontSize: 18 }}></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>
                    {f.name}
                  </div>
                  {f.isExisting && (
                    <div style={{ fontSize: 10.5, color: "var(--g500)" }}>
                      Existing file
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-sm-red"
                  onClick={() => removeCad(idx)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="upload-placeholder"
            onClick={() => cadRef.current.click()}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>
               <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 512 512"
    >
      <g>
        <path
          d="M347.92 260.66q-7.85 34.13-15.68 68.2c-1.93 8.45-3.7 16.93-5.66 25.37-4.26 18.34-19.22 32.13-38.11 32.91-21.76.89-43.62.91-65.38 0-19-.83-33.78-15.33-37.88-34-6.55-29.72-13.46-59.37-20.24-89a37.88 37.88 0 0 0-1.49-4.11c-10.89 0-21.77-.16-32.65 0-13 .25-23.19-4.3-28.63-16.56-5.56-12.53-2.87-23.86 6.36-33.79l93.17-100.24c10.91-11.74 21.77-23.51 32.72-35.21 13.14-14 29.93-14.2 43-.14q62.81 67.39 125.43 135c11.23 12.11 12.87 26.92 4.54 38.9-5.62 8.08-13.58 11.9-23.34 12-11.57.11-23.13.13-34.7.19a8.91 8.91 0 0 0-1.46.48zm37.14-29.18L255.1 91.9 129 229.51l.79 1.83c13.53 0 27.05-.16 40.58 0 13.71.2 17 3.11 20.06 16.35q11.22 49.06 22.48 98.11c2.15 9.36 6.73 13.12 16.37 13.16q26.71.11 53.42 0c9.83 0 14.13-3.51 16.34-13.08 7.62-33.13 15.16-66.29 22.82-99.41 2.79-12.06 6.62-15 19-15 14.01-.01 28 .01 44.2.01z"
          fill="#d12026"
        />
        <path
          d="M256 448.37h-82.75c-43-.08-73.48-30.34-73.86-73.35-.07-8.45-.14-16.91 0-25.36.19-9.36 5.75-15.11 14.19-15.06 8.29.05 14 6.07 14.1 15.27.14 8.67 0 17.35 0 26 .19 24.85 17.64 43.7 42.42 43.91q85.74.71 171.5 0c24.77-.2 42.28-19 42.49-43.86.07-8.67-.09-17.35 0-26 .14-9.26 5.73-15.24 14-15.32s14.29 5.68 14.21 15c-.12 13.76.72 27.78-1.57 41.22-5.64 33.14-34.53 56.76-68.16 57.52h-2z"
          fill="#d12026"
        />
      </g>
    </svg>
            </div>
            <div style={{ fontSize: 13, color: "var(--g500)" }}>
              Click to upload CAD files
            </div>
            <div style={{ fontSize: 11, color: "var(--g300)", marginTop: 4 }}>
              .dwg, .dxf, .stl, .step supported
            </div>
          </div>
        )}
      </div>

      {/* FORM ACTIONS */}
      <div className="form-actions" style={{ marginTop: 0 }}>
        <button className="btn btn-outline" onClick={() => navigate("/styles")}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Saving..." : isEdit ? "Update Style" : "Save Style"}
        </button>
      </div>
    </div>
  );
};

export default StyleForm;
