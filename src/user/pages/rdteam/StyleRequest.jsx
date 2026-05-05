import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    useGetStyleRequestsQuery,
} from "../../../api/RdAPI";
import {
    imgBaseURL,
    formatDate,
} from "../../../helper/Utility";
import ImageGallery from "../../../components/ImageGallery";


const StyleRequest = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("active");

    const { data, isLoading, refetch } = useGetStyleRequestsQuery({
        status: filterStatus,
    });
    const dataList = data?.data || [];


    console.log("dataList", dataList)

    return (
        <div className="page-wrapper">
            <div className="pg-header">
                <div>
                    <div className="pg-title">Requested Styles</div>
                </div>
            </div>

            {/* TABLE CARD */}
            <div className="table-card">
                <div className="table-header">
                    <div className="table-title">
                        All Requested Styles
                        <span
                            style={{
                                fontSize: 12,
                                color: "var(--g500)",
                                fontWeight: 400,
                                marginLeft: 8,
                            }}
                        >
                            ({dataList.length} total)
                        </span>
                    </div>
                </div>

                <table className="erp-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Inquiry Code</th>
                            <th>Client</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Origin</th>
                            <th>Status</th>
                            <th>Attachments</th>
                            <th>Created By</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={10} style={{ textAlign: "center", padding: 30, color: "var(--g500)" }}>Loading...</td></tr>
                        ) : dataList.length === 0 ? (
                            <tr><td colSpan={10} style={{ textAlign: "center", padding: 30, color: "var(--g500)" }}>No records found.</td></tr>
                        ) : (
                            dataList.map((inq, idx) => (
                                <tr key={inq.id}>
                                    <td style={{ color: "var(--g500)", fontSize: 11 }}>{idx + 1}</td>
                                    <td><div style={{ fontWeight: 500 }}>{inq.inquiry_code}</div></td>
                                    <td>{inq.client_name}</td>
                                    <td>{inq.product_desc || "—"}</td>
                                    <td>{inq.quantity}</td>
                                    <td>
                                        <span className="pill p-active">
                                            <span className="pdot" />
                                            {inq.origin?.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`pill ${inq.status === "new" ? "p-active" : "p-inactive"}`}>
                                            <span className="pdot" />
                                            {inq.status}
                                        </span>
                                    </td>
                                    <td>
                                        <ImageGallery attachments={inq?.attachments} />
                                    </td>
                                    <td style={{ color: "var(--g700)" }}>{inq.created_by_name}</td>
                                    <td style={{ fontSize: 11.5, color: "var(--g500)" }}>{formatDate(inq.created_at)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="pagination">
                    <div className="page-info">Showing {dataList.length} styles</div>
                </div>
            </div>
        </div>
    );
};

export default StyleRequest;
