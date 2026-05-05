import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllBOMsQuery,
  useGetAllInquiriesQuery,
  useCreateEstimateRequestMutation,
} from "../../../../api/SalesAPI";
import { showSuccess, showError, formatDate } from "../../../../helper/Utility";

// ── Estimate Request Modal ────────────────────────────────────────────────────
const EstimateRequestModal = ({ bom, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState("");
  const [requestNote, setRequestNote] = useState("");
  const [qErr, setQErr] = useState("");

  // Detect mode: if BOM has inquiry_id → inquiry-linked, else style-only
  const isInquiryMode = Boolean(bom?.inquiry_id);

  const [createEstimateRequest, { isLoading: requesting }] =
    useCreateEstimateRequestMutation();

  const validateQty = (val) => {
    if (!val) return "Quantity is required.";
    if (isNaN(val) || Number(val) <= 0) return "Enter a valid quantity.";
    return "";
  };

  const handleSubmit = async () => {
    // Style-only mode needs quantity
    if (!isInquiryMode) {
      const err = validateQty(quantity);
      if (err) {
        setQErr(err);
        return;
      }
    }

    try {
      let payload = { requestNote: requestNote.trim() || undefined };

      if (isInquiryMode) {
        // Inquiry-linked — backend derives styleId, clientId, quantity from inquiry
        payload.inquiryId = bom.inquiry_id;
      } else {
        // Style-only — must pass styleId, bomId, quantity explicitly
        payload.styleId = bom.style_id;
        payload.bomId = bom.id;
        payload.quantity = parseInt(quantity);
      }

      await createEstimateRequest(payload).unwrap();
      showSuccess(
        "Estimate request sent! Costing team will be notified.",
        "Request Sent",
      );
      onSuccess();
    } catch (err) {
      showError(err?.data?.message || "Something went wrong.");
    }
  };

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
          width: 460,
          padding: "28px 28px 24px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <div>
            <div className="drawer-title" style={{ fontSize: 18 }}>
              Request Estimate
            </div>
            <div style={{ fontSize: 12.5, color: "var(--g500)", marginTop: 4 }}>
              {bom.style_name} · {bom.client_name || "No client"} ·{" "}
              <span className="role-badge rb-rd">
                Rev {bom.current_revision_number}
              </span>
            </div>
            {/* Mode indicator */}
            <div style={{ marginTop: 6 }}>
              <span
                className={`role-badge ${isInquiryMode ? "rb-sales" : "rb-rd"}`}
              >
                {isInquiryMode ? "Inquiry Linked" : "Style Only"}
              </span>
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

        {/* Info box */}
        <div className="info-box" style={{ marginBottom: 16 }}>
          ℹ️ Costing team will receive an email notification and see this in
          their pending requests.
        </div>

        {/* Quantity — only for style-only mode */}
        {!isInquiryMode && (
          <div className="form-grp">
            <label className="form-lbl">Quantity *</label>
            <input
              className={`form-inp ${qErr ? "inp-error" : ""}`}
              type="number"
              placeholder="e.g. 50"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setQErr(validateQty(e.target.value));
              }}
            />
            {qErr && <div className="field-err">{qErr}</div>}
          </div>
        )}

        {/* Inquiry-linked — show qty from inquiry as read-only info */}
        {isInquiryMode && bom.inquiry_quantity && (
          <div
            style={{
              background: "var(--g100)",
              border: "1px solid var(--g200)",
              borderRadius: 6,
              padding: "9px 13px",
              marginBottom: 14,
              fontSize: 12.5,
            }}
          >
            <span style={{ color: "var(--g500)" }}>
              Quantity (from inquiry):{" "}
            </span>
            <strong>{bom.inquiry_quantity} pcs</strong>
          </div>
        )}

        {/* Request Note */}
        <div className="form-grp">
          <label className="form-lbl">Request Note</label>
          <textarea
            className="form-inp"
            rows={3}
            placeholder="e.g. Client is urgent — estimate needed within 2 hours"
            value={requestNote}
            onChange={(e) => setRequestNote(e.target.value)}
            style={{ resize: "vertical", minHeight: 80 }}
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
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: "center" }}
            onClick={handleSubmit}
            disabled={requesting}
          >
            {requesting ? "Sending..." : "📨 Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const BOMs = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [inquiryId, setInquiryId] = useState("");
  const [modalBom, setModalBom] = useState(null);
  const limit = 10;

  const { data, isLoading, refetch } = useGetAllBOMsQuery({
    inquiryId,
    page,
    limit,
  });
  const { data: inquiriesData } = useGetAllInquiriesQuery({ limit: 100 });

  const boms = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalRecs = data?.totalRecords ?? 0;
  const inquiries = inquiriesData?.data || [];

  return (
    <div className="page-wrapper">
      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">BOM</div>
          <div className="pg-sub">
            Bill of Materials — manage component lists linked to client
            inquiries.
          </div>
        </div>
        <div className="btn-row">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/bom-form")}
          >
            ＋ Create BOM
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            All BOMs
            <span
              style={{
                fontSize: 12,
                color: "var(--g500)",
                fontWeight: 400,
                marginLeft: 8,
              }}
            >
              ({totalRecs} total)
            </span>
          </div>
          <div className="table-filters">
            <select
              className="filter-select"
              value={inquiryId}
              onChange={(e) => {
                setInquiryId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Inquiries</option>
              {inquiries.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.inquiry_code} — {i.client_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Inquiry</th>
              <th>Style</th>
              <th>Client</th>
              <th>Revision</th>
              <th>Revision Note</th>
              <th>Created By</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={10}
                  style={{
                    textAlign: "center",
                    padding: 30,
                    color: "var(--g500)",
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : boms.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  style={{
                    textAlign: "center",
                    padding: 30,
                    color: "var(--g500)",
                  }}
                >
                  No BOMs found.
                </td>
              </tr>
            ) : (
              boms.map((bom, idx) => (
                <tr key={bom.id}>
                  <td style={{ color: "var(--g500)", fontSize: 11 }}>
                    {(page - 1) * limit + idx + 1}
                  </td>
                  <td>
                    {/* Show whether this is inquiry-linked or style-only */}
                    <span
                      className={`role-badge ${bom.inquiry_id ? "rb-sales" : "rb-rd"}`}
                    >
                      {bom.inquiry_id ? "Inquiry" : "Style Only"}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "var(--red)",
                        fontSize: 12,
                      }}
                    >
                      {bom.inquiry_code || "—"}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{bom.style_name}</div>
                    <div className="td-meta">{bom.style_code}</div>
                  </td>
                  <td style={{ color: "var(--g700)" }}>
                    {bom.client_name || "—"}
                  </td>
                  <td>
                    <span className="role-badge rb-rd">
                      Rev {bom.current_revision_number}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "var(--g700)",
                        maxWidth: 160,
                      }}
                    >
                      {bom.current_revision_note || "—"}
                    </div>
                  </td>
                  <td style={{ color: "var(--g500)", fontSize: 12 }}>
                    {bom.created_by_name || "—"}
                  </td>
                  <td style={{ fontSize: 11.5, color: "var(--g500)" }}>
                    {formatDate(bom.created_at)}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn-sm"
                        onClick={() => navigate(`/bom-form?id=${bom.id}`)}
                      >
                        View / Revise
                      </button>
                      {
                        bom?.inquiry_status == "bom_in_progress" ?
                        <button
                          className="btn-sm"
                          style={{
                            background: "var(--red)",
                            color: "#fff",
                            border: "none",
                          }}
                          onClick={() => setModalBom(bom)}
                        >
                          Request Estimate
                        </button>
                        :
                        <>---</>
                      }
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pagination">
          <div className="page-info">
            Showing {boms.length} of {totalRecs} BOMs
          </div>
          <div className="page-btns">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`page-btn ${p === page ? "active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* ESTIMATE REQUEST MODAL */}
      {modalBom && (
        <EstimateRequestModal
          bom={modalBom}
          onClose={() => setModalBom(null)}
          onSuccess={() => {
            setModalBom(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default BOMs;
