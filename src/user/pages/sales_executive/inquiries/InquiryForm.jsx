import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetInquiryByIdQuery, useCreateUpdateInquiryMutation, useGetAllClientsQuery } from "../../../../api/SalesAPI";
import { useGetAllStylesQuery } from "../../../../api/RdAPI";
import { useGetAllUsersQuery } from "../../../../api/UserAPI";
import { showSuccess, showError, CURRENCY_SIGN } from "../../../../helper/Utility";
import { ORIGIN_OPTIONS } from "../../../../helper/Constant";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "quoted", label: "Quoted" },
  { value: "negotiating", label: "Negotiating" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "on_hold", label: "On Hold" },
];

const SOURCE_OPTIONS = [
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "walk_in", label: "Walk-in" },
  { value: "reference", label: "Reference" },
];

const CATEGORY_OPTIONS = ["Diamond", "Gold", "Silver", "Platinum", "Kundan", "Polki", "Enamel", "Other"];

const INIT = {
  clientId: "",
  styleId: "",
  productDesc: "",
  quantity: "",
  targetPrice: "",
  requiredDelivery: "",
  source: "",
  origin: "",
  notes: "",
  status: "new",
};

const INIT_ERRS = {
  clientId: "",
  productDesc: "",
  quantity: "",
};

const InquiryForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const isEdit = Boolean(id);

  const [form, setForm] = useState(INIT);
  const [errs, setErrs] = useState(INIT_ERRS);

  const { data: inquiryData, isLoading: fetching } = useGetInquiryByIdQuery(id, { skip: !isEdit });
  const { data: clientsData } = useGetAllClientsQuery({ limit: 100 });
  const { data: stylesData } = useGetAllStylesQuery({ status: "active" });
  const [createUpdateInquiry, { isLoading: saving }] = useCreateUpdateInquiryMutation();

  const clients = clientsData?.data || [];
  const styles = stylesData?.data || [];
  const imgRef = useRef();
  const [imgPreview, setImgPreview] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (inquiryData?.data) {
      const d = inquiryData.data;
      setForm({
        clientId: d.client_id || "",
        styleId: d.style_id || "",
        productDesc: d.product_desc || "",
        quantity: d.quantity || "",
        origin: d.origin || "",
        targetPrice: d.target_price || "",
        requiredDelivery: d.required_delivery ? d.required_delivery.split("T")[0] : "",
        source: d.source || "",
        assignedTo: d.assigned_to || "",
        notes: d.notes || "",
        status: d.status || "new",
      });
    }
  }, [inquiryData]);

  const validate = (name, value) => {
    if (name === "clientId") return !value ? "Client is required." : "";
    if (name === "productDesc") return !value.trim() ? "Product description is required." : "";
    if (name === "quantity") return !value ? "Quantity is required."
      : isNaN(value) || Number(value) <= 0 ? "Enter a valid quantity." : "";
    return "";
  };

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
      setRemovedImages((p) => [...p, item.name]);
    } else {
      const newIdx = imgPreview
        .slice(0, idx)
        .filter((i) => !i.isExisting).length;
      setImages((p) => p.filter((_, i) => i !== newIdx));
    }
    setImgPreview((p) => p.filter((_, i) => i !== idx));
  };

  console.log("form",form)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (name in errs) setErrs((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name in errs) setErrs((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const validateAll = () => {
    const next = {
      clientId: validate("clientId", form.clientId),
      productDesc: validate("productDesc", form.productDesc),
      quantity: validate("quantity", form.quantity),
    };
    setErrs(next);
    return Object.values(next).every((e) => !e);
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;
    try {
      const formData = new FormData();

      if (isEdit) formData.append("id", id);
      formData.append("clientId", parseInt(form.clientId));
      if (form.styleId) formData.append("styleId", parseInt(form.styleId));
      if (form.assignedTo) formData.append("assignedTo", parseInt(form.assignedTo));
      if (form.productDesc) formData.append("productDesc", form.productDesc);
      formData.append("quantity", parseInt(form.quantity));
      formData.append("origin", form.origin);
      if (form.targetPrice) formData.append("targetPrice", parseFloat(form.targetPrice));
      if (form.requiredDelivery) formData.append("requiredDelivery", form.requiredDelivery);
      if (form.source) formData.append("source", form.source);
      if (form.notes) formData.append("notes", form.notes);
      formData.append("status", form.status);

      if(images?.length > 0){
        images.forEach((f) => formData.append("designs", f));
      }

      await createUpdateInquiry(formData).unwrap();
      showSuccess(isEdit ? "Inquiry updated successfully." : "Inquiry created successfully.", isEdit ? "Updated" : "Created");
      navigate("/inquiries");
    } catch (err) {
      showError(err?.data?.message || "Something went wrong.");
    }
  };
  if (isEdit && fetching) {
    return <div className="page-wrapper"><div style={{ padding: 40, textAlign: "center", color: "var(--g500)" }}>Loading inquiry...</div></div>;
  }

  return (
    <div className="page-wrapper">

      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">{isEdit ? "Edit Inquiry" : "New Inquiry"}</div>
          <div className="pg-sub">{isEdit ? `Editing: ${form.productDesc || "inquiry"}` : "Log a new client inquiry into the sales pipeline."}</div>
        </div>
        <div className="btn-row">
          <button className="btn btn-outline" onClick={() => navigate("/inquiries")}>← Back to Inquiries</button>
        </div>
      </div>

      <div className="form-panel">
        <div className="form-panel-header">
          <div className="form-panel-title">Inquiry Details</div>
        </div>

        <div className="form-grid">

          {/* Client */}
          <div className="form-grp">
            <label className="form-lbl">Client *</label>
            <select className={`form-select ${errs.clientId ? "inp-error" : ""}`} name="clientId" value={form.clientId} onChange={handleChange} onBlur={handleBlur}>
              <option value="">Select client...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.client_name}</option>)}
            </select>
            {errs.clientId && <div className="field-err">{errs.clientId}</div>}
          </div>

          {/* Style — optional */}
          <div className="form-grp">
            <label className="form-lbl">Style (optional)</label>
            <select className="form-select" name="styleId" value={form.styleId} onChange={handleChange}>
              <option value="">Select style...</option>
              {styles.map((s) => <option key={s.id} value={s.id}>{s.style_code} — {s.style_name}</option>)}
            </select>
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
              {ORIGIN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Product Description */}
          <div className="form-grp" style={{ gridColumn: "1 / -1" }}>
            <label className="form-lbl">Product Description *</label>
            <input className={`form-inp ${errs.productDesc ? "inp-error" : ""}`} name="productDesc" placeholder="e.g. Diamond Bracelet Set" value={form.productDesc} onChange={handleChange} onBlur={handleBlur} />
            {errs.productDesc && <div className="field-err">{errs.productDesc}</div>}
          </div>


          {/* Quantity */}
          <div className="form-grp">
            <label className="form-lbl">Quantity *</label>
            <input className={`form-inp ${errs.quantity ? "inp-error" : ""}`} name="quantity" type="number" placeholder="e.g. 25" value={form.quantity} onChange={handleChange} onBlur={handleBlur} />
            {errs.quantity && <div className="field-err">{errs.quantity}</div>}
          </div>

          {/* Target Price */}
          <div className="form-grp">
            <label className="form-lbl">Target Price ({CURRENCY_SIGN}/pc)</label>
            <input className="form-inp" name="targetPrice" type="number" placeholder="e.g. 66000" value={form.targetPrice} onChange={handleChange} />
          </div>

          {/* Required Delivery */}
          <div className="form-grp">
            <label className="form-lbl">Required Delivery</label>
            <input className="form-inp" name="requiredDelivery" type="date" value={form.requiredDelivery} onChange={handleChange} />
          </div>

          {/* Source */}
          <div className="form-grp">
            <label className="form-lbl">Source</label>
            <select className="form-select" name="source" value={form.source} onChange={handleChange}>
              <option value="">Select source...</option>
              {SOURCE_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Status — edit only */}
          {isEdit && (
            <div className="form-grp">
              <label className="form-lbl">Status</label>
              <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          )}

          {/* Notes */}
          <div className="form-grp" style={{ gridColumn: "1 / -1" }}>
            <label className="form-lbl">Notes</label>
            <textarea className="form-inp" name="notes" rows={3} placeholder="e.g. Client wants extra rhodium plating" value={form.notes} onChange={handleChange} style={{ resize: "vertical", minHeight: 80 }} />
          </div>

        </div>
        <div className="row mt-3">
          <div className="col-12">
            <div className="form-panel-header">
              <div className="form-panel-title">Images</div>
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
                <div style={{ fontSize: 28, marginBottom: 6 }}>🖼</div>
                <div style={{ fontSize: 13, color: "var(--g500)" }}>
                  Click to upload style images
                </div>
                <div style={{ fontSize: 11, color: "var(--g300)", marginTop: 4 }}>
                  JPG, PNG supported
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-outline" onClick={() => navigate("/inquiries")}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : isEdit ? "💾 Update Inquiry" : "💾 Save Inquiry"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryForm;