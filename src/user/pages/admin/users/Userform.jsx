import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../../../api/UserAPI";
import { showSuccess, showError } from "../../../../helper/Utility";
import { useTranslation } from "../../../../helper/useTranslation";

const ROLES = [
  { value: "rd_team", label: "RD Team" },
  { value: "sourcing_team", label: "Sourcing Team" },
  { value: "costing_team", label: "Costing Team" },
  { value: "sales_executive", label: "Sales Executive" },
  { value: "production_manager", label: "Production Manager" },
  { value: "qc_supervisor", label: "QC Supervisor" },
  { value: "vendor", label: "Vendor" },
];

const INIT = { firstName: "", lastName: "", email: "", phone: "", role: "" };
const INIT_ERRS = { firstName: "", lastName: "", email: "", role: "" };

// ── inline email check ──────────────────────────────────────────────────────
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const UserForm = () => {
    const { t } = useTranslation();
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(INIT);
  const [errs, setErrs] = useState(INIT_ERRS);

  const { data: userData, isLoading: fetching } = useGetUserByIdQuery(id, {
    skip: !isEdit,
  });
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  useEffect(() => {
    if (userData?.data) {
      const u = userData.data;
      setForm({
        firstName: u.first_name || "",
        lastName: u.last_name || "",
        email: u.email || "",
        phone: u.phone || "",
        role: u.role || "",
      });
    }
  }, [userData]);

  // ── per-field validation on blur / change ───────────────────────────────
  const validate = (name, value) => {
    switch (name) {
      case "firstName":
        return !value.trim() ? t("firstNameRequired") : "";
      case "lastName":
        return !value.trim() ? t("lastNameRequired") : "";
      case "email":
        return !value.trim()
          ? t("emailRequired")
          : !isValidEmail(value)
            ? t("emailInvalid")
            : "";
      case "role":
        return !value ? t("roleRequired") : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    // clear error as user types
    if (errs[name] !== undefined) {
      setErrs((p) => ({ ...p, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (errs[name] !== undefined) {
      setErrs((p) => ({ ...p, [name]: validate(name, value) }));
    }
  };

  // ── validate all before submit ───────────────────────────────────────────
  const validateAll = () => {
    const next = {
      firstName: validate("firstName", form.firstName),
      lastName: validate("lastName", form.lastName),
      email: validate("email", form.email),
      role: validate("role", form.role),
    };
    setErrs(next);
    return Object.values(next).every((e) => !e);
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;
    try {
      if (isEdit) {
        await updateUser({ id, ...form }).unwrap();
        showSuccess(t("userUpdatedSuccess"), "Updated");
      } else {
        await createUser(form).unwrap();
        showSuccess(
          t("userCreatedSuccess"),
          "User Created",
        );
      }
      navigate("/users");
    } catch (err) {
      showError(
        err?.data?.message || t('somethingWentWrong'),
      );
    }
  };

  if (isEdit && fetching) {
    return (
      <div className="page-wrapper">
        <div style={{ padding: 40, textAlign: "center", color: "var(--g500)" }}>
          {t("Loading...")}
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
            {isEdit ? t("Edit User") : t("Add New User")}
          </div>
          <div className="pg-sub">
            {isEdit
              ? `Updating details for ${form.firstName} ${form.lastName}`
              : t('createUserRole')}
          </div>
        </div>
        <div className="btn-row">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/users")}
          >
            {t("Back to Users")}
          </button>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="form-panel">

        {!isEdit && (
          <div className="info-box" style={{ margin: "0 0 16px" }}>
             {t("credentialsInfo")}
          </div>
        )}

        <div className="form-grid">
          {/* First Name */}
          <div className="form-grp">
            <label className="form-lbl">{t('First Name')} *</label>
            <input
              className={`form-inp ${errs.firstName ? "inp-error" : ""}`}
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errs.firstName && (
              <div className="field-err">{errs.firstName}</div>
            )}
          </div>

          {/* Last Name */}
          <div className="form-grp">
            <label className="form-lbl">{t('Last Name')} *</label>
            <input
              className={`form-inp ${errs.lastName ? "inp-error" : ""}`}
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errs.lastName && <div className="field-err">{errs.lastName}</div>}
          </div>

          {/* Email */}
          <div className="form-grp">
            <label className="form-lbl">{t('Email')} *</label>
            <input
              className={`form-inp ${errs.email ? "inp-error" : ""}`}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isEdit}
              style={
                isEdit
                  ? {
                      background: "var(--g100)",
                      color: "var(--g500)",
                      cursor: "not-allowed",
                    }
                  : {}
              }
            />
            {errs.email ? (
              <div className="field-err">{errs.email}</div>
            ) : (
              isEdit && (
                <div
                  style={{ fontSize: 11, color: "var(--g500)", marginTop: 4 }}
                >
                  Email cannot be changed after creation.
                </div>
              )
            )}
          </div>

          {/* Phone — optional, no validation */}
          <div className="form-grp">
            <label className="form-lbl">{t("Phone")}</label>
            <input
              className="form-inp"
              name="phone"
              placeholder="+91 98100 00000"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* Role */}
          <div className="form-grp">
            <label className="form-lbl">{t('Role')} *</label>
            <select
              className={`form-select ${errs.role ? "inp-error" : ""}`}
              name="role"
              value={form.role}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isEdit}
              style={
                isEdit
                  ? {
                      background: "var(--g100)",
                      color: "var(--g500)",
                      cursor: "not-allowed",
                    }
                  : {}
              }
            >
              <option value="">{t('selectRole')}</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {errs.role ? (
              <div className="field-err">{errs.role}</div>
            ) : (
              isEdit && (
                <div
                  style={{ fontSize: 11, color: "var(--g500)", marginTop: 4 }}
                >
                  Role cannot be changed after creation.
                </div>
              )
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/users")}
          >
            {t('Cancel')}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={creating || updating}
          >
            {creating || updating
              ? t("loading")
              : isEdit
                ? t("update")
                : t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
