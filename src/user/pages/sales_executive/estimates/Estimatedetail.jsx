import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetEstimateByIdQuery } from "../../../../api/CostingAPI";
import {
  formatDate,
  CURRENCY_SIGN,
} from "../../../../helper/Utility";
import { CreateQuoteModal } from "../../../../components/CreateQuoteModal";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (val) =>
  val != null && val !== ""
    ? `${CURRENCY_SIGN}${Number(val).toLocaleString("en-IN")}`
    : "—";

const materialTypeBadge = (type) => {
  const map = {
    metal: { cls: "rb-rd", label: "Metal" },
    stone: { cls: "rb-sales", label: "Stone" },
    labor: { cls: "rb-production", label: "Labor" },
    plating: { cls: "rb-costing", label: "Plating" },
    finding: { cls: "rb-qc", label: "Finding" },
    other: { cls: "rb-vendor", label: "Other" },
  };
  const m = map[type] || { cls: "rb-vendor", label: type };
  return <span className={`role-badge ${m.cls}`}>{m.label}</span>;
};

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

const BreakdownRow = ({ label, value, isTotal, highlight }) => (
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
        color: "var(--black)",
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

// ── Create Quote Modal ────────────────────────────────────────────────────────


// ── Main ──────────────────────────────────────────────────────────────────────
const EstimateDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const { data, isLoading } = useGetEstimateByIdQuery(id);
  const est = data?.data || null;
  const bomItems = est?.bomItems || [];

  if (isLoading)
    return (
      <div className="page-wrapper">
        <div style={{ padding: 40, textAlign: "center", color: "var(--g500)" }}>
          Loading...
        </div>
      </div>
    );
  if (!est)
    return (
      <div className="page-wrapper">
        <div style={{ padding: 40, textAlign: "center", color: "var(--red)" }}>
          Estimate not found.
        </div>
      </div>
    );

  const metalCost = parseFloat(est.metal_cost) || 0;
  const stoneCost = parseFloat(est.stone_cost) || 0;
  const laborCost = parseFloat(est.labor_cost) || 0;
  const platingCost = parseFloat(est.plating_cost) || 0;
  const overheadPct = parseFloat(est.overhead_pct) || 0;
  const subtotal = metalCost + stoneCost + laborCost + platingCost;
  const overheadAmt = subtotal * (overheadPct / 100);
  const totalCost = parseFloat(est.total_cost) || 0;
  const targetPrice = est.target_price ? parseFloat(est.target_price) : null;
  const withinBudget = targetPrice ? totalCost <= targetPrice : null;

  return (
    <div className="page-wrapper">
      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">Estimate Detail</div>
          <div className="pg-sub">
            {est.style_name} · {est.client_name} · {est.inquiry_code}
          </div>
        </div>
        <div className="btn-row">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/estimates")}
          >
            ← Back
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowQuoteModal(true)}
          >
            📄 Create Quote
          </button>
        </div>
      </div>

      <div className="two-col" style={{ alignItems: "flex-start" }}>
        {/* LEFT — Request info + BOM items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Request Details */}
          <div className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-title">Request Details</div>
              <span
                className={`role-badge ${est.status === "draft" ? "rb-vendor" : "rb-qc"}`}
              >
                {est.status}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0 24px",
              }}
            >
              <InfoRow label="Inquiry" value={est.inquiry_code} />
              <InfoRow
                label="Style"
                value={`${est.style_name} (${est.style_code})`}
              />
              <InfoRow label="Client" value={est.client_name} />
              <InfoRow label="Product" value={est.product_desc} />
              <InfoRow label="Quantity" value={`${est.quantity} pcs`} />
              <InfoRow
                label="BOM Revision"
                value={`Rev ${est.revision_number}`}
              />
              <InfoRow label="Requested By" value={est.requested_by_name} />
              <InfoRow label="Created On" value={formatDate(est.created_at)} />
              {est.request_note && (
                <div style={{ gridColumn: "1 / -1", marginBottom: 14 }}>
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
                    Request Note
                  </div>
                  <div style={{ fontSize: 13, color: "var(--g700)" }}>
                    {est.request_note}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BOM Items */}
          <div className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-title">BOM Items</div>
              {est.rates_snapshot?.snapshot_date && (
                <div style={{ fontSize: 11, color: "var(--g500)" }}>
                  📸 Rates snapshot: {est.rates_snapshot.snapshot_date}
                </div>
              )}
            </div>
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Rate</th>
                  <th style={{ textAlign: "right" }}>Cost</th>
                </tr>
              </thead>
              <tbody>
                {bomItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        padding: 20,
                        color: "var(--g500)",
                      }}
                    >
                      No items found.
                    </td>
                  </tr>
                ) : (
                  bomItems.map((item) => {
                    const rate = item.current_rate
                      ? parseFloat(item.current_rate)
                      : 0;
                    const qty = parseFloat(item.quantity);
                    const itemCost = rate > 0 ? rate * qty : null;
                    return (
                      <tr key={item.id}>
                        <td>{materialTypeBadge(item.material_type)}</td>
                        <td style={{ fontWeight: 500 }}>{item.description}</td>
                        <td>{qty}</td>
                        <td style={{ color: "var(--g500)" }}>{item.unit}</td>
                        <td style={{ color: "var(--g700)" }}>
                          {rate > 0 ? (
                            fmt(rate)
                          ) : (
                            <span style={{ color: "var(--amber)" }}>
                              No rate
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 500 }}>
                          {itemCost != null && rate > 0 ? (
                            fmt(itemCost)
                          ) : (
                            <span style={{ color: "var(--g300)" }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT — Cost breakdown */}
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
                  {withinBudget
                    ? "Within client budget"
                    : "Exceeds client budget"}
                </div>
                <div
                  style={{ fontSize: 12, color: "var(--g500)", marginTop: 2 }}
                >
                  Target: {fmt(targetPrice)} / pc · Estimate: {fmt(totalCost)} /
                  pc
                </div>
              </div>
            </div>
          )}

          {/* Cost Breakdown */}
          <div className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-title">Cost Breakdown</div>
              <div style={{ fontSize: 11, color: "var(--g500)" }}>
                per piece
              </div>
            </div>
            <BreakdownRow label="Metal Cost" value={fmt(metalCost)} />
            <BreakdownRow label="Stone Cost" value={fmt(stoneCost)} />
            <BreakdownRow label="Labor Cost" value={fmt(laborCost)} />
            <BreakdownRow label="Plating Cost" value={fmt(platingCost)} />
            <BreakdownRow
              label={`Overhead (${overheadPct}%)`}
              value={fmt(overheadAmt)}
              highlight="var(--g500)"
            />
            <BreakdownRow
              label="Total Cost / Piece"
              value={fmt(totalCost)}
              isTotal
            />
            {est.quantity > 1 && (
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
                <span>Total for {est.quantity} pcs</span>
                <span style={{ fontWeight: 600, color: "var(--black)" }}>
                  {fmt(totalCost * est.quantity)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE QUOTE MODAL */}
      {showQuoteModal && (
        <CreateQuoteModal
          est={est}
          onClose={() => setShowQuoteModal(false)}
          onSuccess={() => {
            setShowQuoteModal(false);
          }}
        />
      )}
    </div>
  );
};

export default EstimateDetail;
