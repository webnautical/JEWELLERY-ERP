import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetQuoteByIdQuery } from "../../../../api/SalesAPI";
import { formatDate, CURRENCY_SIGN } from "../../../../helper/Utility";

const fmt = (val) =>
  val != null && val !== ""
    ? `${CURRENCY_SIGN}${Number(val).toLocaleString("en-IN")}`
    : "—";

const QuotePDF = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  const { data, isLoading } = useGetQuoteByIdQuery(id);
  const q = data?.data || null;

  const handlePrint = () => window.print();

  if (isLoading)
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
        Loading quote...
      </div>
    );
  if (!q)
    return (
      <div style={{ padding: 40, textAlign: "center", color: "red" }}>
        Quote not found.
      </div>
    );

  const isExpired = q.valid_until && new Date(q.valid_until) < new Date();
  const totalForAll = parseFloat(q.total_value) || 0;

  return (
    <>
      {/* ── Print action bar — hidden on print ── */}
      <div className="pdf-action-bar no-print">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <span style={{ fontSize: 13, color: "var(--g500)" }}>
            {q.quote_code} · {q.client_name}
          </span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨 Print / Save as PDF
          </button>
        </div>
      </div>

      {/* ── Printable Quote Document ── */}
      <div className="pdf-page" ref={printRef}>
        {/* Header */}
        <div className="pdf-header">
          <div className="pdf-brand">
            <div className="pdf-logo">CATTIVO</div>
            <div className="pdf-tagline">JEWELRY</div>
          </div>
          <div className="pdf-doc-info">
            <div className="pdf-doc-title">QUOTATION</div>
            <table className="pdf-meta-table">
              <tbody>
                <tr>
                  <td className="pdf-meta-label">Quote No.</td>
                  <td className="pdf-meta-value">{q.quote_code}</td>
                </tr>
                <tr>
                  <td className="pdf-meta-label">Version</td>
                  <td className="pdf-meta-value">v{q.version}</td>
                </tr>
                <tr>
                  <td className="pdf-meta-label">Date</td>
                  <td className="pdf-meta-value">{formatDate(q.created_at)}</td>
                </tr>
                <tr>
                  <td className="pdf-meta-label">Valid Until</td>
                  <td
                    className="pdf-meta-value"
                    style={{ color: isExpired ? "#d12026" : "inherit" }}
                  >
                    {q.valid_until ? formatDate(q.valid_until) : "—"}
                    {isExpired && " (Expired)"}
                  </td>
                </tr>
                {q.delivery_date && (
                  <tr>
                    <td className="pdf-meta-label">Delivery By</td>
                    <td className="pdf-meta-value">
                      {formatDate(q.delivery_date)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pdf-divider" />

        {/* Bill To + Inquiry ref */}
        <div className="pdf-parties">
          <div className="pdf-bill-to">
            <div className="pdf-section-label">BILL TO</div>
            <div className="pdf-client-name">{q.client_name}</div>
            {q.client_email && (
              <div className="pdf-client-detail">{q.client_email}</div>
            )}
            {q.client_phone && (
              <div className="pdf-client-detail">{q.client_phone}</div>
            )}
          </div>
          <div className="pdf-ref-box">
            <div className="pdf-section-label">REFERENCE</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              <div>
                <span style={{ color: "#888" }}>Inquiry: </span>
                {q.inquiry_code}
              </div>
              <div>
                <span style={{ color: "#888" }}>Style: </span>
                {q.style_code} — {q.style_name}
              </div>
              <div>
                <span style={{ color: "#888" }}>Prepared By: </span>
                {q.created_by_name}
              </div>
            </div>
          </div>
        </div>

        <div className="pdf-divider" />

        {/* Items table */}
        <table className="pdf-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}>#</th>
              <th>Product Description</th>
              <th style={{ textAlign: "center" }}>Qty</th>
              <th style={{ textAlign: "right" }}>Unit Price</th>
              <th style={{ textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <div style={{ fontWeight: 600 }}>{q.product_desc}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                  {q.style_name} · {q.style_code}
                </div>
                {q.notes && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#555",
                      marginTop: 4,
                      fontStyle: "italic",
                    }}
                  >
                    Note: {q.notes}
                  </div>
                )}
              </td>
              <td style={{ textAlign: "center" }}>{q.quantity} pcs</td>
              <td style={{ textAlign: "right" }}>{fmt(q.quote_per_piece)}</td>
              <td style={{ textAlign: "right", fontWeight: 600 }}>
                {fmt(totalForAll)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="pdf-totals">
          <div className="pdf-total-row">
            <span>Subtotal</span>
            <span>{fmt(totalForAll)}</span>
          </div>
          <div className="pdf-total-row pdf-grand-total">
            <span>Grand Total</span>
            <span>{fmt(totalForAll)}</span>
          </div>
          {q.target_price && (
            <div
              className="pdf-total-row"
              style={{
                fontSize: 11,
                color: "#888",
                borderTop: "none",
                paddingTop: 4,
              }}
            >
              <span>Client Target Price</span>
              <span>{fmt(q.target_price)} / pc</span>
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="pdf-terms">
          <div className="pdf-section-label" style={{ marginBottom: 8 }}>
            TERMS & CONDITIONS
          </div>
          <div className="pdf-terms-list">
            <div>
              1. This quotation is valid until{" "}
              {q.valid_until
                ? formatDate(q.valid_until)
                : "the date mentioned above"}
              .
            </div>
            <div>
              2. Prices are subject to change after the validity period.
            </div>
            <div>3. A deposit may be required before production commences.</div>
            <div>
              4. Delivery timeline is subject to production capacity and
              material availability.
            </div>
            {q.delivery_date && (
              <div>5. Expected delivery by {formatDate(q.delivery_date)}.</div>
            )}
          </div>
        </div>

        {/* All versions — small reference */}
        {q.allVersions?.length > 1 && (
          <div className="pdf-versions no-print">
            <div className="pdf-section-label" style={{ marginBottom: 8 }}>
              ALL VERSIONS
            </div>
            <table className="pdf-table" style={{ fontSize: 11 }}>
              <thead>
                <tr>
                  <th>Quote Code</th>
                  <th>Version</th>
                  <th style={{ textAlign: "right" }}>Price / pc</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                  <th>Valid Until</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {q.allVersions.map((v) => (
                  <tr
                    key={v.id}
                    style={{
                      background:
                        v.id === q.id ? "rgba(209,32,38,0.04)" : "transparent",
                    }}
                  >
                    <td style={{ fontWeight: v.id === q.id ? 700 : 400 }}>
                      {v.quote_code}
                    </td>
                    <td>v{v.version}</td>
                    <td style={{ textAlign: "right" }}>
                      {fmt(v.quote_per_piece)}
                    </td>
                    <td style={{ textAlign: "right" }}>{fmt(v.total_value)}</td>
                    <td>{v.valid_until ? formatDate(v.valid_until) : "—"}</td>
                    <td style={{ textTransform: "capitalize" }}>{v.status}</td>
                    <td>{formatDate(v.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="pdf-footer">
          <div>Thank you for your business.</div>
          <div style={{ marginTop: 4, color: "#aaa" }}>
            Generated by Cattivo Jewelry ERP ·{" "}
            {new Date().toLocaleDateString("en-IN")}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuotePDF;
