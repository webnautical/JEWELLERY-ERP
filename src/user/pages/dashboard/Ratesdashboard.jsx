import React, { useState } from "react";
import {
  useGetRateDashboardQuery,
  useCreateRateMutation,
} from "../../../api/RatesAPI";
import {
  showSuccess,
  showError,
  timeAgo,
  CURRENCY_SIGN,
} from "../../../helper/Utility";





const fmt = (val) => (val != null ? `${CURRENCY_SIGN}${Number(val)}` : "—");

const SpotlightCard = ({ rate }) => {
  const up = rate.change_direction === "up";
  return (
    <div className="rate-spotlight-card">
      <div className="rsc-header">
        <div className="rsc-label">
          {rate.material_name} {rate.grade}
        </div>
      
      </div>
      <div className="rsc-rate">{fmt(rate.rate)}</div>
      <div className="rsc-unit">per {rate.unit}</div>
      {rate.change_amount != null && rate.change_amount !== 0 ? (
        <div className={`rsc-change ${up ? "rsc-up" : "rsc-down"}`}>
          {up ? "▲" : "▼"} {fmt(Math.abs(rate.change_amount))} from yesterday
        </div>
      ) : (
        <div className="rsc-change rsc-flat">— No change</div>
      )}
      <div className="rsc-meta">
        Updated {timeAgo(rate.created_at)} by {rate.updated_by_name || "—"}
      </div>
    </div>
  );
};

// ── Inline editable rate row ──────────────────────────────────────────────────
const RateRow = ({ rate, idx, onSave, saving }) => {
  const [val, setVal] = useState(rate.rate ?? "");

  const handleSave = () => {
    if (!val || isNaN(val) || Number(val) <= 0) {
      showError("Please enter a valid rate.");
      return;
    }
    onSave(rate.asset_id, val);
  };

  return (
    <tr>
      <td style={{ color: "var(--g500)", fontSize: 11 }}>{idx + 1}</td>
      <td>
        <div style={{ fontWeight: 500 }}>{rate.material_name}</div>
      </td>
      <td style={{ color: "var(--g700)" }}>{rate.grade}</td>
      <td>
        <input
          className="rate-inline-inp"
          type="number"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
      </td>
      <td style={{ color: "var(--g500)" }}>/ {rate.unit}</td>
      <td>
        <button
          className="btn btn-primary"
          style={{ padding: "5px 16px", fontSize: 12 }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "..." : "Save"}
        </button>
      </td>
    </tr>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
const SourcingDashboard = () => {
  const { data, isLoading, refetch } = useGetRateDashboardQuery();
  const [createRate, { isLoading: saving }] = useCreateRateMutation();

  const rates = data?.data?.rates || [];
  const history = data?.data?.history || [];
  const pending = data?.data?.pendingEstimatesCount ?? 0;

  // top 4 for spotlight (first 4 active rates)
  const spotlight = rates.slice(0, 4);

  const handleSave = async (assetId, rate) => {
    try {
      await createRate({ assetId, rate: parseFloat(rate) }).unwrap();
      showSuccess("Rate updated successfully.");
      refetch();
    } catch (err) {
      showError(err?.data?.message || "Something went wrong.");
    }
  };

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <div style={{ padding: 40, textAlign: "center", color: "var(--g500)" }}>
          Loading rates...
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">Material Rates</div>
          <div className="pg-sub">
            Update daily market rates for gold, silver, diamonds and other
            materials.
          </div>
        </div>
      </div>

      {/* IMPACT ALERT BANNER */}
      <div className="rate-alert-banner">
        <i class="bi bi-exclamation-octagon-fill"></i> Rates updated here reflect immediately in all NEW estimates. Existing
        estimates and production orders keep their frozen snapshot — they will
        NOT be affected.
      </div>

      {/* SPOTLIGHT CARDS */}
      <div className="rate-spotlight-grid">
        {spotlight.map((rate) => (
          <SpotlightCard key={rate.asset_id} rate={rate} />
        ))}
      </div>

      {/* BOTTOM SECTION — table + history */}
      <div className="rate-bottom-grid">
        {/* LEFT — editable rates table */}
        <div className="table-card" style={{ flex: 1 }}>
          <div className="table-header">
            <div className="table-title">Current Rates</div>
          </div>
          <table className="erp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Material</th>
                <th>Grade / Type</th>
                <th>Current Rate</th>
                <th>Unit</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {rates.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: 30,
                      color: "var(--g500)",
                    }}
                  >
                    No rates found.
                  </td>
                </tr>
              ) : (
                rates.map((rate, idx) => (
                  <RateRow
                    key={rate.asset_id}
                    rate={rate}
                    idx={idx}
                    onSave={handleSave}
                    saving={saving}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* RIGHT — history + impact */}
        <div className="rate-right-col">
          {/* Rate Change History */}
          <div className="table-card">
            <div
              className="table-header"
              style={{
                borderBottom: "1px solid var(--g200)",
                paddingBottom: 12,
              }}
            >
              <div className="table-title">Rate Change History</div>
            </div>
            <div className="rate-history-list">
              {history.length === 0 ? (
                <div
                  style={{ padding: 20, color: "var(--g500)", fontSize: 13 }}
                >
                  No history yet.
                </div>
              ) : (
                history.map((h) => {
                  const isUp = h.change_direction === "up";
                  return (
                    <div key={h.id} className="rate-history-item">
                      <div className="rhi-left">
                        <div className="rhi-name">
                          {h.material_name} {h.grade}
                        </div>
                      </div>
                      <div className="rhi-right">
                        <div
                          className={`rhi-val ${isUp ? "rhi-up" : h.change_direction === "down" ? "rhi-down" : ""}`}
                        >
                          {isUp
                            ? "▲"
                            : h.change_direction === "down"
                              ? "▼"
                              : ""}{" "}
                          {Number(h.rate).toLocaleString("en-IN")}
                        </div>
                        <div className="rhi-date">{timeAgo(h.created_at)}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Impact Alert */}
          {pending > 0 && (
            <div className="rate-impact-card">
              <div className="ric-title">⚡ Impact Alert</div>
              <div className="ric-body">
                <strong>{pending}</strong> pending estimate
                {pending !== 1 ? "s" : ""} will use updated rates when costing
                team runs new calculations.
              </div>
              <div className="ric-note">
                Costing team should re-run estimates after major rate changes.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SourcingDashboard;
