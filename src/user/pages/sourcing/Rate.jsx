import React, { useState } from "react";
import { useCreateRateMutation } from "../../../api/RatesAPI";
import { showSuccess, showError } from "../../../helper/Utility";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadingBTN from "../../../components/LoadingBTN";
import { UNITS } from "../../../helper/Constant";

const INIT_FORM = {
    materialName: "",
    unit: "",
    rate: "",
    rateDate: new Date().toISOString().split("T")[0]
};

const INIT_ERRS = {
    materialName: "",
    unit: "",
    rate: ""
};

const Rate = () => {
    const locationData = useLocation()
    const editData = locationData?.state
    const [form, setForm] = useState({
        materialName: editData?.material_name || "",
        unit: editData?.unit || "",
        rate: editData?.current_rate || "",
        rateDate: new Date().toISOString().split("T")[0]
    });
    const [errs, setErrs] = useState(INIT_ERRS);
    const navigate = useNavigate()
    const [createRate, { isLoading: saving }] = useCreateRateMutation();

    const validate = (name, value) => {
        if (name === "materialName") return !value?.trim() ? "Please enter material name." : "";
        if (name === "unit") return !value ? "Please select a unit." : "";
        if (name === "rate") return !value ? "Rate is required."
            : isNaN(value) || Number(value) <= 0 ? "Enter a valid rate." : "";
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
            materialName: validate("materialName", form.materialName),
            unit: validate("unit", form.unit),
            rate: validate("rate", form.rate),
        };
        setErrs(next);
        return Object.values(next).every((e) => !e);
    };

    const handleSubmit = async () => {
        if (!validateAll()) return;
        try {
            await createRate({
                materialName: form.materialName.trim(),
                unit: form.unit,
                rate: parseFloat(form.rate),
                rateDate: form.rateDate,
            }).unwrap();
            showSuccess("Rate saved successfully.");
            setForm({
                materialName: "",
                unit: "",
                rate: "",
                rateDate: new Date().toISOString().split("T")[0]
            });
            setErrs(INIT_ERRS);
            navigate('/assets');
        } catch (err) {
            showError(err?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div className="page-wrapper">

            {/* PAGE HEADER */}
            <div className="pg-header">
                <div>
                    <div className="pg-title">Add Rate</div>
                    <div className="pg-sub">Enter today's market rate for a material asset.</div>
                </div>
            </div>

            {/* FORM */}
            <div className="form-panel">
                <div className="form-panel-header">
                    <div className="form-panel-title">Rate Entry</div>
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

                    <div className="form-grp">
                        <label className="form-lbl">Rate *</label>
                        <input
                            className={`form-inp ${errs.rate ? "inp-error" : ""}`}
                            name="rate"
                            type="number"
                            step="0.01"
                            placeholder="e.g. 6800"
                            value={form.rate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errs.rate && <div className="field-err">{errs.rate}</div>}
                    </div>

                    <div className="form-grp">
                        <label className="form-lbl">Rate Date</label>
                        <input
                            className="form-inp"
                            name="rateDate"
                            type="date"
                            value={form.rateDate}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                <div className="form-actions">
                    <Link to={'/assets'} className="btn btn-primary">
                        Cancel
                    </Link>
                    {
                        saving ?
                            <LoadingBTN />
                            :
                            <button className="btn btn-primary" onClick={handleSubmit}>
                                Save Rate
                            </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default Rate;