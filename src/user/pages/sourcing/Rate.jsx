import React, { useState } from "react";
import { useCreateRateMutation, useGetAllAssetsQuery } from "../../../api/RatesAPI";
import { showSuccess, showError } from "../../../helper/Utility";
import { useNavigate } from "react-router-dom";
import LoadingBTN from "../../../components/LoadingBTN";

const INIT_FORM = { assetId: "", rate: "", rateDate: new Date().toISOString().split("T")[0] };
const INIT_ERRS = { assetId: "", rate: "" };

const Rate = () => {
    const [form, setForm] = useState(INIT_FORM);
    const [errs, setErrs] = useState(INIT_ERRS);
    const navigate = useNavigate()
    const { data: assetsData } = useGetAllAssetsQuery({ status: "active" });
    const [createRate, { isLoading: saving }] = useCreateRateMutation();

    const assets = assetsData?.data || [];

    const validate = (name, value) => {
        if (name === "assetId") return !value ? "Please select a material." : "";
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
            assetId: validate("assetId", form.assetId),
            rate: validate("rate", form.rate),
        };
        setErrs(next);
        return Object.values(next).every((e) => !e);
    };

    const handleSubmit = async () => {
        if (!validateAll()) return;
        try {
            await createRate({
                assetId: parseInt(form.assetId),
                rate: parseFloat(form.rate),
                rateDate: form.rateDate,
            }).unwrap();
            showSuccess("Rate saved successfully.");
            setForm({ assetId: "", rate: "", rateDate: new Date().toISOString().split("T")[0] });
            setErrs(INIT_ERRS);
            navigate('/rates-dashboard')
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
                        <label className="form-lbl">Material *</label>
                        <select
                            className={`form-select ${errs.assetId ? "inp-error" : ""}`}
                            name="assetId"
                            value={form.assetId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        >
                            <option value="">Select material...</option>
                            {assets.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.material_name} {a.grade} / {a.unit}
                                </option>
                            ))}
                        </select>
                        {errs.assetId && <div className="field-err">{errs.assetId}</div>}
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