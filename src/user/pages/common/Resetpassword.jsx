import React, { useState } from "react";
import { useChangePasswordMutation } from "../../../api/auth/AuthAPI";
import { showSuccess, showError } from "../../../helper/Utility";

const INIT_FORM = { oldPassword: "", newPassword: "", confirmPassword: "" };
const INIT_ERRS = { oldPassword: "", newPassword: "", confirmPassword: "" };

// ── Must be outside component to prevent remount on every render ──────────
const PwdField = ({ label, name, show, onToggle, placeholder, value, onChange, onBlur, err }) => (
    <div className="form-grp">
        <label className="form-lbl">{label} *</label>
        <div style={{
            display: "flex",
            alignItems: "center",
            border: `1px solid ${err ? "var(--red)" : "var(--g200)"}`,
            borderRadius: 6,
            background: "#fff",
            transition: "border-color .15s",
        }}>
            <input
                className="form-inp"
                name={name}
                type={show ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                style={{ border: "none", flex: 1, outline: "none", boxShadow: "none" }}
            />
            <span
                onClick={onToggle}
                style={{ padding: "0 12px", cursor: "pointer", fontSize: 15, color: "var(--g500)", flexShrink: 0 }}
            >
                {show ? "🙈" : "👁"}
            </span>
        </div>
        {err && <div className="field-err">{err}</div>}
    </div>
);

// ── Main ──────────────────────────────────────────────────────────────────
const Resetpassword = () => {
    const [form, setForm]       = useState(INIT_FORM);
    const [errs, setErrs]       = useState(INIT_ERRS);
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showCon, setShowCon] = useState(false);

    const [changePassword, { isLoading: saving }] = useChangePasswordMutation();

    const validate = (name, value) => {
        if (name === "oldPassword") return !value ? "Current password is required." : "";
        if (name === "newPassword") {
            if (!value)               return "New password is required.";
            if (value.length < 8)     return "Password must be at least 8 characters.";
            if (!/[A-Z]/.test(value)) return "Must contain at least one uppercase letter.";
            if (!/[0-9]/.test(value)) return "Must contain at least one number.";
            return "";
        }
        if (name === "confirmPassword") {
            if (!value)                     return "Please confirm your new password.";
            if (value !== form.newPassword)  return "Passwords do not match.";
            return "";
        }
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
            oldPassword:     validate("oldPassword",     form.oldPassword),
            newPassword:     validate("newPassword",     form.newPassword),
            confirmPassword: validate("confirmPassword", form.confirmPassword),
        };
        setErrs(next);
        return Object.values(next).every((e) => !e);
    };

    const handleSubmit = async () => {
        if (!validateAll()) return;
        try {
            await changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword }).unwrap();
            showSuccess("Password changed successfully. Please log in again.", "Password Updated");
            setForm(INIT_FORM);
            setErrs(INIT_ERRS);
        } catch (err) {
            showError(err?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div className="page-wrapper">

            {/* PAGE HEADER */}
            <div className="pg-header">
                <div>
                    <div className="pg-title">Profile</div>
                    <div className="pg-sub">Manage your account settings and security.</div>
                </div>
            </div>

            {/* CHANGE PASSWORD */}
            <div className="form-panel">
                <div className="form-panel-header">
                    <div className="form-panel-title">Change Password</div>
                </div>

                <div className="info-box" style={{ marginBottom: 16 }}>
                    🔒 Choose a strong password — at least 8 characters with one uppercase letter and one number.
                </div>

                <div className="form-grid">
                    <PwdField
                        label="Current Password"
                        name="oldPassword"
                        show={showOld}
                        onToggle={() => setShowOld((p) => !p)}
                        placeholder="Enter current password"
                        value={form.oldPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        err={errs.oldPassword}
                    />
                    <PwdField
                        label="New Password"
                        name="newPassword"
                        show={showNew}
                        onToggle={() => setShowNew((p) => !p)}
                        placeholder="Enter new password"
                        value={form.newPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        err={errs.newPassword}
                    />
                    <PwdField
                        label="Confirm New Password"
                        name="confirmPassword"
                        show={showCon}
                        onToggle={() => setShowCon((p) => !p)}
                        placeholder="Re-enter new password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        err={errs.confirmPassword}
                    />
                </div>

                <div className="form-actions">
                    <button className="btn btn-outline" onClick={() => { setForm(INIT_FORM); setErrs(INIT_ERRS); }}>
                        Reset
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                        {saving ? "Saving..." : "🔒 Change Password"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Resetpassword;