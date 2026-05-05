import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetInquiryByIdQuery } from "../../../../api/SalesAPI";
import { CURRENCY_SIGN, formatDate, imgBaseURL } from "../../../../helper/Utility";
import ImageGallery from "../../../../components/ImageGallery";

const STATUS_MAP = {
  new: { cls: "rb-rd", label: "New" },
  reviewing: { cls: "rb-sourcing", label: "Reviewing" },
  quoted: { cls: "rb-sales", label: "Quoted" },
  negotiating: { cls: "rb-costing", label: "Negotiating" },
  accepted: { cls: "rb-qc", label: "Accepted" },
  rejected: { cls: "rb-vendor", label: "Rejected" },
  on_hold: { cls: "rb-production", label: "On Hold" },
};

const SOURCE_LABELS = {
  phone: "Phone",
  email: "Email",
  whatsapp: "WhatsApp",
  walk_in: "Walk-in",
  reference: "Reference",
};

const InfoRow = ({ label, value }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "var(--g500)", marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: 500 }}>{value || "—"}</div>
  </div>
);

const InquiryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGetInquiryByIdQuery(id);

  const inq = data?.data || null;

  if (isLoading) return <div className="page-wrapper"><div style={{ padding: 40, textAlign: "center", color: "var(--g500)" }}>Loading...</div></div>;
  if (!inq) return <div className="page-wrapper"><div style={{ padding: 40, textAlign: "center", color: "var(--red)" }}>Inquiry not found.</div></div>;

  const statusInfo = STATUS_MAP[inq.status] || { cls: "rb-vendor", label: inq.status };
  console.log("inq", inq)
  return (
    <div className="page-wrapper">

      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {inq.inquiry_code}
            <span className={`role-badge ${statusInfo.cls}`}>{statusInfo.label}</span>
          </div>
          <div className="pg-sub">{inq.client_name} · {inq.product_desc}</div>
        </div>
        <div className="btn-row">
          <button className="btn btn-outline" onClick={() => navigate("/inquiries")}>← Back</button>
          <button className="btn btn-primary" onClick={() => navigate(`/inquiry-form?id=${inq.id}`)}>Edit Inquiry</button>
        </div>
      </div>

      <div className="two-col" style={{ alignItems: "flex-start" }}>

        {/* LEFT — Inquiry info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Client + Product */}
          <div className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-title">Inquiry Details</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
              <InfoRow label="Inquiry ID" value={inq.inquiry_code} />
              <InfoRow label="Status" value={<span className={`role-badge ${statusInfo.cls}`}>{statusInfo.label}</span>} />
              <InfoRow label="Client" value={inq.client_name} />
              <InfoRow label="Client Phone" value={inq.client_phone} />
              <InfoRow label="Product" value={inq.product_desc} />
              <InfoRow label="Quantity" value={`${inq.quantity} pcs`} />
              <InfoRow label="Target Price" value={inq.target_price ? `${CURRENCY_SIGN}${Number(inq.target_price).toLocaleString("en-IN")} / pc` : "—"} />
              <InfoRow label="Required By" value={inq.required_delivery ? formatDate(inq.required_delivery) : "—"} />
              <InfoRow label="Source" value={SOURCE_LABELS[inq.source] || inq.source} />
              <InfoRow label="Assigned To" value={inq.assigned_to_name} />
              <InfoRow label="Created By" value={inq.created_by_name} />
              {inq.style_name && (
                <InfoRow label="Style" value={`${inq.style_code} — ${inq.style_name}`} />
              )}
              <InfoRow label="Created On" value={formatDate(inq.created_at)} />
            </div>
            {inq.notes && (
              <div style={{ marginTop: 8, paddingTop: 12, borderTop: "1px solid var(--g200)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "var(--g500)", marginBottom: 6 }}>Notes</div>
                <div style={{ fontSize: 13, color: "var(--g700)", lineHeight: 1.6 }}>{inq.notes}</div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Quotes + Attachments */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Quotes */}
          <div className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-title">Quotes</div>
            </div>
            {inq.quotes?.length === 0 ? (
              <div style={{ padding: "12px 0", fontSize: 13, color: "var(--g500)" }}>No quotes yet for this inquiry.</div>
            ) : (
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Quote ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {inq.quotes.map((q) => (
                    <tr key={q.id}>
                      <td style={{ fontWeight: 500, color: "var(--red)" }}>{q.quote_code}</td>
                      <td>{q.total_amount ? `${CURRENCY_SIGN}${Number(q.total_amount).toLocaleString("en-IN")}` : "—"}</td>
                      <td><span className="role-badge rb-sales">{q.status}</span></td>
                      <td style={{ fontSize: 11.5, color: "var(--g500)" }}>{formatDate(q.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Attachments */}
          <div className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-title">Attachments</div>
            </div>
            {inq.attachments?.length === 0 ? (
              <div style={{ padding: "12px 0", fontSize: 13, color: "var(--g500)" }}>No attachments uploaded.</div>
            ) : (
              <>
                <ImageGallery attachments={inq?.attachments} width={"100px"} height={"100px"}/>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetail;