import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    useGetUserByIdQuery,
    useUpdateUserMutation,
} from "../../../api/UserAPI";
import { showSuccess, showError, authUser } from "../../../helper/Utility";
import LoadingBTN from "../../../components/LoadingBTN";

const INIT = { firstName: "", lastName: "", email: "", phone: "" };
const INIT_ERRS = { firstName: "", lastName: "", email: "" };

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const Profile = () => {
    const navigate = useNavigate();
    const authInfo = authUser()
    const id = authInfo?.id;
    const isEdit = Boolean(id);
    const [form, setForm] = useState(INIT);
    const [errs, setErrs] = useState(INIT_ERRS);
    const { data: userData, isLoading: fetching } = useGetUserByIdQuery(id);
    const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

    useEffect(() => {
        if (userData?.data) {
            const u = userData.data;
            setForm({
                firstName: u.first_name || "",
                lastName: u.last_name || "",
                email: u.email || "",
                phone: u.phone || "",
            });
        }
    }, [userData]);

    const validate = (name, value) => {
        switch (name) {
            case "firstName":
                return !value.trim() ? "First name is required." : "";
            case "lastName":
                return !value.trim() ? "Last name is required." : "";
            case "email":
                return !value.trim()
                    ? "Email is required."
                    : !isValidEmail(value)
                        ? "Enter a valid email address."
                        : "";
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
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
            await updateUser({ id, ...form }).unwrap();
            showSuccess("User updated successfully", "Updated");
        } catch (err) {
            showError(
                err?.data?.message || "Something went wrong. Please try again.",
            );
        }
    };

    if (isEdit && fetching) {
        return (
            <div className="page-wrapper">
                <div style={{ padding: 40, textAlign: "center", color: "var(--g500)" }}>
                    Loading user...
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            {/* PAGE HEADER */}
            <div className="pg-header">
                <div>
                    <div className="pg-title"> Profile </div>
                    <div className="pg-sub">
                        Details for {form.firstName} {form.lastName}
                    </div>
                </div>
                <div className="btn-row">
                    <button className="btn btn-outline" onClick={() => navigate(-1)}>
                        ← Back to Users
                    </button>
                </div>
            </div>

            {/* FORM CARD */}
            <div className="form-panel">

                <div className="form-grid">
                    {/* First Name */}
                    <div className="form-grp">
                        <label className="form-lbl">First Name *</label>
                        <input
                            className={`form-inp ${errs.firstName ? "inp-error" : ""}`}
                            name="firstName"
                            placeholder=""
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
                        <label className="form-lbl">Last Name *</label>
                        <input
                            className={`form-inp ${errs.lastName ? "inp-error" : ""}`}
                            name="lastName"
                            placeholder=""
                            value={form.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errs.lastName && <div className="field-err">{errs.lastName}</div>}
                    </div>

                    {/* Email */}
                    <div className="form-grp">
                        <label className="form-lbl">Email *</label>
                        <input
                            className={`form-inp ${errs.email ? "inp-error" : ""}`}
                            name="email"
                            type="email"
                            placeholder=""
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
                        <label className="form-lbl">Phone</label>
                        <input
                            className="form-inp"
                            name="phone"
                            placeholder=""
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </div>


                </div>

                <div className="form-actions">
                    <button className="btn btn-outline" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    {
                        updating ?
                            <LoadingBTN />
                            :
                            <button className="btn btn-primary" onClick={handleSubmit}>
                                    Update User
                            </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default Profile;
