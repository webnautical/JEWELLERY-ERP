import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateUpdateClientMutation } from "../../../../api/SalesAPI";
import { showSuccess, showError } from "../../../../helper/Utility";

const INIT      = { clientName: "", email: "", phone: "", address: "" };
const INIT_ERRS = { clientName: "", phone: "" };

const isValidEmail = (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // optional field
const isValidPhone = (v) => !v || /^[0-9+\s\-()]{7,15}$/.test(v);        // optional field

const ClientForm = () => {
  const navigate               = useNavigate();
  const [searchParams]         = useSearchParams();
  const id                     = searchParams.get("id");
  const isEdit                 = Boolean(id);

  const [form, setForm] = useState(INIT);
  const [errs, setErrs] = useState(INIT_ERRS);

  const [createUpdateClient, { isLoading: saving }] = useCreateUpdateClientMutation();

  // ── If edit — prefill from location state (passed from listing) ────────────
  useEffect(() => {
    if (isEdit && window.history.state?.usr) {
      const c = window.history.state.usr;
      setForm({
        clientName: c.client_name || "",
        email:      c.email       || "",
        phone:      c.phone       || "",
        address:    c.address     || "",
      });
    }
  }, [isEdit]);

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (name, value) => {
    if (name === "clientName") return !value.trim()          ? "Client name is required."      : "";
    if (name === "email")      return !isValidEmail(value)   ? "Enter a valid email address."  : "";
    if (name === "phone")      return !isValidPhone(value)   ? "Enter a valid phone number."   : "";
    return "";
  };

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
      clientName: validate("clientName", form.clientName),
      email:      validate("email",      form.email),
      phone:      validate("phone",      form.phone),
    };
    setErrs(next);
    return Object.values(next).every((e) => !e);
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;
    try {
      const payload = isEdit ? { id, ...form } : form;
      await createUpdateClient(payload).unwrap();
      showSuccess(isEdit ? "Client updated successfully." : "Client created successfully.", isEdit ? "Updated" : "Created");
      navigate("/clients");
    } catch (err) {
      showError(err?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="page-wrapper">

      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">{isEdit ? "Edit Client" : "Add New Client"}</div>
          <div className="pg-sub">{isEdit ? `Updating details for ${form.clientName}` : "Add a new jewelry client to the system."}</div>
        </div>
        <div className="btn-row">
          <button className="btn btn-outline" onClick={() => navigate("/clients")}>← Back to Clients</button>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="form-panel">
        <div className="form-panel-header">
          <div className="form-panel-title">{isEdit ? "Edit Client Details" : "New Client Details"}</div>
        </div>

        <div className="form-grid">

          <div className="form-grp">
            <label className="form-lbl">Client Name *</label>
            <input
              className={`form-inp ${errs.clientName ? "inp-error" : ""}`}
              name="clientName"
              placeholder="e.g. Rohit Jewellers"
              value={form.clientName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errs.clientName && <div className="field-err">{errs.clientName}</div>}
          </div>

          <div className="form-grp">
            <label className="form-lbl">Email</label>
            <input
              className={`form-inp ${errs.email ? "inp-error" : ""}`}
              name="email"
              type="email"
              placeholder="rohit@example.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errs.email && <div className="field-err">{errs.email}</div>}
          </div>

          <div className="form-grp">
            <label className="form-lbl">Phone</label>
            <input
              className={`form-inp ${errs.phone ? "inp-error" : ""}`}
              name="phone"
              placeholder="e.g. 9810000000"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errs.phone && <div className="field-err">{errs.phone}</div>}
          </div>

          <div className="form-grp" style={{ gridColumn: "1 / -1" }}>
            <label className="form-lbl">Address</label>
            <textarea
              className="form-inp"
              name="address"
              rows={3}
              placeholder="e.g. Mumbai, Maharashtra"
              value={form.address}
              onChange={handleChange}
              style={{ resize: "vertical", minHeight: 80 }}
            />
          </div>

        </div>

        <div className="form-actions">
          <button className="btn btn-outline" onClick={() => navigate("/clients")}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : isEdit ? "💾 Update Client" : "💾 Save Client"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;