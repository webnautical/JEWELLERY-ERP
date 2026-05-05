import { useState } from "react";
import { useCreateQuoteMutation } from "../api/SalesAPI";
import { CURRENCY_SIGN, showError, showSuccess } from "../helper/Utility";
import { useNavigate } from "react-router-dom";

export const CreateQuoteModal = ({ est,modalType, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        marginPct: "25",
        validUntil: "",
        deliveryDate: "",
        notes: "",
        action: "draft",
    });
    const [errs, setErrs] = useState({ marginPct: "", validUntil: "" });

    const [createQuote, { isLoading: saving }] = useCreateQuoteMutation();
    const navigate = useNavigate()
    // Live quote price preview
    const costPerPiece = parseFloat(est?.cost_per_piece) || 0;
    const margin = parseFloat(form.marginPct) || 0;
    const quotePerPiece = costPerPiece * (1 + margin / 100);
    const totalValue = quotePerPiece * (est?.quantity || 1);

    const validate = (name, value) => {
        if (name === "marginPct")
            return !value || isNaN(value) || Number(value) < 0
                ? "Enter a valid margin %."
                : "";
        if (name === "validUntil")
            return !value ? "Valid until date is required." : "";
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
            marginPct: validate("marginPct", form.marginPct),
            validUntil: validate("validUntil", form.validUntil),
        };
        setErrs(next);
        return Object.values(next).every((e) => !e);
    };

    const handleSubmit = async (action) => {
        if (!validateAll()) return;
        const payloadID = modalType == "quote" ? {quoteId : est?.id} : {estimateId: est.id}
        try {
            const res = await createQuote({
                ...payloadID,
                marginPct: parseFloat(form.marginPct),
                validUntil: form.validUntil,
                deliveryDate: form.deliveryDate || undefined,
                notes: form.notes || undefined,
                action,
            }).unwrap();

            showSuccess(
                action === "send"
                    ? `Quote ${res.data?.quote_code} sent to client via email.`
                    : `Quote ${res.data?.quote_code} saved as draft.`,
                action === "send" ? "Quote Sent" : "Draft Saved",
                () => {
                    navigate(`/quote-pdf/${res?.data?.id}`)
                }
            );
            onSuccess(res?.data);
        } catch (err) {
            showError(err?.data?.message || "Something went wrong.");
        }
    };

    const fmt = (val) =>
        val != null && val !== ""
            ? `${CURRENCY_SIGN}${Number(val).toLocaleString("en-IN")}`
            : "—";

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
                zIndex: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 12,
                    width: 500,
                    padding: "28px 28px 24px",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 20,
                    }}
                >
                    <div>
                        <div className="drawer-title" style={{ fontSize: 18 }}>
                            Create Quote
                        </div>
                        <div style={{ fontSize: 12.5, color: "var(--g500)", marginTop: 4 }}>
                            {est.style_name} · {est.client_name} · {est.inquiry_code}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: "var(--g100)",
                            border: "none",
                            borderRadius: "50%",
                            width: 30,
                            height: 30,
                            cursor: "pointer",
                            fontSize: 14,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Cost reference */}
                <div
                    style={{
                        background: "var(--g100)",
                        border: "1px solid var(--g200)",
                        borderRadius: 8,
                        padding: "10px 14px",
                        marginBottom: 16,
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12.5,
                    }}
                >
                    <span style={{ color: "var(--g500)" }}>Cost per piece</span>
                    <span style={{ fontWeight: 700 }}>{fmt(costPerPiece)}</span>
                </div>

                {/* Margin % */}
                <div className="form-grp">
                    <label className="form-lbl">Margin % *</label>
                    <input
                        className={`form-inp ${errs.marginPct ? "inp-error" : ""}`}
                        name="marginPct"
                        type="number"
                        step="0.5"
                        placeholder="e.g. 25"
                        value={form.marginPct}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {errs.marginPct && <div className="field-err">{errs.marginPct}</div>}
                </div>

                {/* Live price preview */}
                <div
                    style={{
                        background: "rgba(209,32,38,0.04)",
                        border: "1px solid rgba(209,32,38,0.15)",
                        borderRadius: 8,
                        padding: "12px 14px",
                        marginBottom: 16,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 6,
                            fontSize: 12.5,
                        }}
                    >
                        <span style={{ color: "var(--g500)" }}>Quote per piece</span>
                        <span style={{ fontWeight: 700, color: "var(--red)" }}>
                            {fmt(quotePerPiece)}
                        </span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 12.5,
                        }}
                    >
                        <span style={{ color: "var(--g500)" }}>
                            Total value ({est.quantity} pcs)
                        </span>
                        <span style={{ fontWeight: 700 }}>{fmt(totalValue)}</span>
                    </div>
                    {est.target_price && (
                        <div
                            style={{
                                marginTop: 8,
                                paddingTop: 8,
                                borderTop: "1px solid rgba(209,32,38,0.1)",
                                fontSize: 11.5,
                                color:
                                    quotePerPiece <= parseFloat(est.target_price)
                                        ? "var(--green)"
                                        : "var(--red)",
                            }}
                        >
                            {quotePerPiece <= parseFloat(est.target_price)
                                ? "✅ Within"
                                : "⚠️ Exceeds"}{" "}
                            client target: {fmt(est.target_price)} / pc
                        </div>
                    )}
                </div>

                {/* Valid Until */}
                <div className="form-grp">
                    <label className="form-lbl">Valid Until *</label>
                    <input
                        className={`form-inp ${errs.validUntil ? "inp-error" : ""}`}
                        name="validUntil"
                        type="date"
                        value={form.validUntil}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {errs.validUntil && (
                        <div className="field-err">{errs.validUntil}</div>
                    )}
                </div>

                {/* Delivery Date */}
                <div className="form-grp">
                    <label className="form-lbl">Expected Delivery Date</label>
                    <input
                        className="form-inp"
                        name="deliveryDate"
                        type="date"
                        value={form.deliveryDate}
                        onChange={handleChange}
                    />
                </div>

                {/* Notes */}
                <div className="form-grp">
                    <label className="form-lbl">Notes</label>
                    <textarea
                        className="form-inp"
                        name="notes"
                        rows={3}
                        placeholder="e.g. Special packaging required"
                        value={form.notes}
                        onChange={handleChange}
                        style={{ resize: "vertical", minHeight: 70 }}
                    />
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <button
                        className="btn btn-outline"
                        style={{ flex: 1, justifyContent: "center" }}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-outline"
                        style={{ flex: 1, justifyContent: "center" }}
                        onClick={() => handleSubmit("draft")}
                        disabled={saving}
                    >
                        💾 Save Draft
                    </button>
                    <button
                        className="btn btn-primary"
                        style={{ flex: 1, justifyContent: "center" }}
                        onClick={() => handleSubmit("send")}
                        disabled={saving}
                    >
                        {saving ? "Sending..." : "📨 Send to Client"}
                    </button>
                </div>
            </div>
        </div>
    );
};