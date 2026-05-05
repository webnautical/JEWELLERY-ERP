import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetQuoteByIdQuery } from "../../../../api/SalesAPI";
import { formatDate, CURRENCY_SIGN } from "../../../../helper/Utility";
import { CreateQuoteModal } from "../../../../components/CreateQuoteModal";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (val) =>
    val != null && val !== ""
        ? `${CURRENCY_SIGN}${Number(val).toLocaleString("en-IN")}`
        : "—";

const isExpired = (validUntil) =>
    validUntil && new Date(validUntil) < new Date();

const STATUS_OPTIONS = [
    { value: "draft", label: "Draft", cls: "rb-vendor" },
    { value: "sent", label: "Sent", cls: "rb-sales" },
    { value: "accepted", label: "Accepted", cls: "rb-qc" },
    { value: "rejected", label: "Rejected", cls: "rb-rd" },
    { value: "negotiating", label: "Negotiating", cls: "rb-costing" },
    { value: "expired", label: "Expired", cls: "rb-production" },
];

const statusBadge = (status) => {
    const found = STATUS_OPTIONS.find((s) => s.value === status);
    return (
        <span className={`role-badge ${found?.cls || "rb-vendor"}`}>
            {found?.label || status}
        </span>
    );
};

// ── Sub-components ────────────────────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
    <div style={{ marginBottom: 14 }}>
        <div
            style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: "var(--g500)",
                marginBottom: 3,
            }}
        >
            {label}
        </div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{value || "—"}</div>
    </div>
);

const BreakdownRow = ({ label, value, isTotal, highlight, muted }) => (
    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isTotal ? "10px 0 0" : "6px 0",
            borderTop: isTotal ? "1px solid var(--g200)" : "none",
            marginTop: isTotal ? 6 : 0,
        }}
    >
        <div
            style={{
                fontSize: isTotal ? 13 : 12.5,
                fontWeight: isTotal ? 700 : 400,
                color: muted ? "var(--g500)" : "var(--black)",
            }}
        >
            {label}
        </div>
        <div
            style={{
                fontSize: isTotal ? 15 : 12.5,
                fontWeight: isTotal ? 700 : 500,
                color: highlight || (isTotal ? "var(--red)" : "var(--black)"),
            }}
        >
            {value}
        </div>
    </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const QuoteDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeVersionId, setActiveVersionId] = useState(null);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const { data, isLoading } = useGetQuoteByIdQuery(id);
    const quote = data?.data || null;

    if (isLoading)
        return (
            <div className="page-wrapper">
                <div style={{ padding: 40, textAlign: "center", color: "var(--g500)" }}>
                    Loading...
                </div>
            </div>
        );

    if (!quote)
        return (
            <div className="page-wrapper">
                <div style={{ padding: 40, textAlign: "center", color: "var(--red)" }}>
                    Quote not found.
                </div>
            </div>
        );

    const allVersions = quote.allVersions || [];
    // Active version — default to the current quote (by id)
    const activeVersion =
        allVersions.find((v) => v.id === (activeVersionId ?? quote.id)) || quote;

    const costPerPiece = parseFloat(quote.cost_per_piece) || 0;
    const marginPct = parseFloat(activeVersion.margin_pct) || 0;
    const quotePerPiece = parseFloat(activeVersion.quote_per_piece) || 0;
    const totalValue = parseFloat(activeVersion.total_value) || 0;
    const targetPrice = quote.target_price ? parseFloat(quote.target_price) : null;
    const marginAmt = quotePerPiece - costPerPiece;
    const withinBudget = targetPrice ? quotePerPiece <= targetPrice : null;
    const expired = isExpired(activeVersion.valid_until);

    return (
        <div className="page-wrapper">
            {/* PAGE HEADER */}
            <div className="pg-header">
                <div>
                    <div className="pg-title">Quote Detail</div>
                    <div className="pg-sub">
                        {quote.style_name} · {quote.client_name} · {quote.inquiry_code}
                    </div>
                </div>
                <div className="btn-row">
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate("/quotes")}
                    >
                        ← Back
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowQuoteModal(true)}
                    >
                        Create Revision
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate(`/quote-pdf/${quote.id}`)}
                    >
                        🖨 Print
                    </button>

                </div>
            </div>

            <div className="two-col" style={{ alignItems: "flex-start" }}>
                {/* LEFT — Quote info + version history */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                    {/* Quote Details */}
                    <div className="form-panel">
                        <div className="form-panel-header">
                            <div className="form-panel-title">Quote Details</div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                {expired && quote.status !== "accepted" && (
                                    <span className="role-badge rb-production">Expired</span>
                                )}
                                {statusBadge(quote.status)}
                            </div>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "0 24px",
                            }}
                        >
                            <InfoRow label="Quote Code" value={quote.quote_code} />
                            <InfoRow label="Version" value={`v${quote.version}`} />
                            <InfoRow label="Inquiry" value={quote.inquiry_code} />
                            <InfoRow label="Style" value={`${quote.style_name} (${quote.style_code})`} />
                            <InfoRow label="Client" value={quote.client_name} />
                            <InfoRow label="Product" value={quote.product_desc} />
                            <InfoRow label="Quantity" value={`${quote.quantity} pcs`} />
                            <InfoRow label="Created By" value={quote.created_by_name} />
                            <InfoRow
                                label="Valid Until"
                                value={
                                    quote.valid_until ? (
                                        <span style={{ color: expired ? "var(--red)" : "inherit", fontWeight: expired ? 600 : 500 }}>
                                            {formatDate(quote.valid_until)}
                                            {expired && " (Expired)"}
                                        </span>
                                    ) : "—"
                                }
                            />
                            <InfoRow
                                label="Delivery Date"
                                value={quote.delivery_date ? formatDate(quote.delivery_date) : "—"}
                            />
                            <InfoRow label="Created On" value={formatDate(quote.created_at)} />
                            <InfoRow label="Inquiry Source" value={quote.inquiry_source} />
                        </div>
                        {quote.notes && (
                            <div style={{ marginTop: 4 }}>
                                <div
                                    style={{
                                        fontSize: 9,
                                        fontWeight: 700,
                                        letterSpacing: "1.2px",
                                        textTransform: "uppercase",
                                        color: "var(--g500)",
                                        marginBottom: 3,
                                    }}
                                >
                                    Notes
                                </div>
                                <div style={{ fontSize: 13, color: "var(--g700)" }}>
                                    {quote.notes}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Client Info */}
                    <div className="form-panel">
                        <div className="form-panel-header">
                            <div className="form-panel-title">Client Info</div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
                            <InfoRow label="Client Name" value={quote.client_name} />
                            <InfoRow label="Email" value={quote.client_email} />
                            <InfoRow label="Phone" value={quote.client_phone} />
                            <InfoRow label="Inquiry Status" value={
                                <span className={`role-badge ${STATUS_OPTIONS.find(s => s.value === quote.inquiry_status)?.cls || "rb-vendor"}`}>
                                    {quote.inquiry_status}
                                </span>
                            } />
                        </div>
                    </div>

                    {/* Version History */}
                    {allVersions.length > 0 && (
                        <div className="form-panel">
                            <div className="form-panel-header">
                                <div className="form-panel-title">Version History</div>
                                <span style={{ fontSize: 11, color: "var(--g500)" }}>
                                    {allVersions.length} version{allVersions.length > 1 ? "s" : ""}
                                </span>
                            </div>
                            <table className="erp-table">
                                <thead>
                                    <tr>
                                        <th>Version</th>
                                        <th>Quote Code</th>
                                        <th>Margin</th>
                                        <th>Per Piece</th>
                                        <th>Total Value</th>
                                        <th>Valid Until</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allVersions.map((v) => {
                                        const isActive = v.id === (activeVersionId ?? quote.id);
                                        const vExpired = isExpired(v.valid_until);
                                        return (
                                            <tr
                                                key={v.id}
                                                onClick={() => setActiveVersionId(v.id)}
                                                style={{
                                                    cursor: "pointer",
                                                    background: isActive ? "var(--g50)" : "transparent",
                                                    opacity: vExpired && v.status !== "accepted" ? 0.65 : 1,
                                                }}
                                            >
                                                <td>
                                                    <span style={{ fontWeight: 700, color: "var(--red)" }}>
                                                        v{v.version}
                                                    </span>
                                                    {isActive && (
                                                        <span style={{ fontSize: 10, color: "var(--g400)", marginLeft: 4 }}>
                                                            ← viewing
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={{ fontWeight: 500, fontSize: 12 }}>{v.quote_code}</td>
                                                <td style={{ color: "var(--g600)" }}>{v.margin_pct}%</td>
                                                <td style={{ fontWeight: 600 }}>{fmt(v.quote_per_piece)}</td>
                                                <td style={{ fontWeight: 600 }}>{fmt(v.total_value)}</td>
                                                <td>
                                                    <span style={{ fontSize: 12, color: vExpired ? "var(--red)" : "var(--g700)" }}>
                                                        {v.valid_until ? formatDate(v.valid_until) : "—"}
                                                    </span>
                                                </td>
                                                <td>{statusBadge(v.status)}</td>
                                                <td style={{ fontSize: 11.5, color: "var(--g500)" }}>
                                                    {formatDate(v.created_at)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* RIGHT — Pricing breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                    {/* Budget comparison */}
                    {targetPrice && (
                        <div
                            style={{
                                background: withinBudget
                                    ? "rgba(34,160,90,0.05)"
                                    : "rgba(209,32,38,0.05)",
                                border: `1px solid ${withinBudget ? "rgba(34,160,90,0.2)" : "rgba(209,32,38,0.2)"}`,
                                borderRadius: 10,
                                padding: "14px 18px",
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <div style={{ fontSize: 24 }}>{withinBudget ? "✅" : "⚠️"}</div>
                            <div>
                                <div
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: withinBudget ? "var(--green)" : "var(--red)",
                                    }}
                                >
                                    {withinBudget ? "Within client budget" : "Exceeds client budget"}
                                </div>
                                <div style={{ fontSize: 12, color: "var(--g500)", marginTop: 2 }}>
                                    Target: {fmt(targetPrice)} / pc · Quote: {fmt(quotePerPiece)} / pc
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pricing Breakdown */}
                    <div className="form-panel">
                        <div className="form-panel-header">
                            <div className="form-panel-title">Pricing Breakdown</div>
                            <div style={{ fontSize: 11, color: "var(--g500)" }}>
                                v{activeVersion.version} · per piece
                            </div>
                        </div>

                        <BreakdownRow
                            label="Cost / Piece"
                            value={fmt(costPerPiece)}
                        />
                        <BreakdownRow
                            label={`Margin (${marginPct}%)`}
                            value={fmt(marginAmt)}
                            highlight="var(--g500)"
                            muted
                        />
                        <BreakdownRow
                            label="Quote Price / Piece"
                            value={fmt(quotePerPiece)}
                            isTotal
                        />

                        {/* Total for quantity */}
                        {quote.quantity > 1 && (
                            <div
                                style={{
                                    marginTop: 8,
                                    padding: "8px 0",
                                    borderTop: "1px solid var(--g200)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: 12,
                                    color: "var(--g500)",
                                }}
                            >
                                <span>Total for {quote.quantity} pcs</span>
                                <span style={{ fontWeight: 600, color: "var(--black)" }}>
                                    {fmt(totalValue)}
                                </span>
                            </div>
                        )}

                        {/* Target price row */}
                        {targetPrice && (
                            <div
                                style={{
                                    marginTop: 4,
                                    padding: "8px 0",
                                    borderTop: "1px solid var(--g200)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: 12,
                                    color: "var(--g500)",
                                }}
                            >
                                <span>Client target price</span>
                                <span style={{ fontWeight: 600, color: withinBudget ? "var(--green)" : "var(--red)" }}>
                                    {fmt(targetPrice)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Quick stats */}
                    <div className="form-panel">
                        <div className="form-panel-header">
                            <div className="form-panel-title">Quick Stats</div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {[
                                { label: "Total Versions", value: allVersions.length },
                                { label: "Current Version", value: `v${quote.version}` },
                                { label: "Quote Value", value: fmt(totalValue) },
                                { label: "Margin %", value: `${marginPct}%` },
                            ].map(({ label, value }) => (
                                <div
                                    key={label}
                                    style={{
                                        background: "var(--g50)",
                                        borderRadius: 8,
                                        padding: "10px 14px",
                                    }}
                                >
                                    <div style={{ fontSize: 10, color: "var(--g500)", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 4 }}>
                                        {label}
                                    </div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--black)" }}>
                                        {value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {showQuoteModal && (
                <CreateQuoteModal
                    est={quote}
                    modalType={"quote"}
                    onClose={() => setShowQuoteModal(false)}
                    onSuccess={() => {
                        setShowQuoteModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default QuoteDetails;