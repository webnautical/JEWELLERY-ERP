import React from 'react'
import { useTranslation } from '../helper/useTranslation'

const Pagination = ({name, length, totalRecord, page, setPage, totalPages }) => {
    const {t} = useTranslation();
    return (
        <>
            <div className="pagination">
                <div className="page-info">{t("Showing")} {length} {t("of")} {totalRecord} {t(name)}</div>
                <div className="page-btns">
                    <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>{t("Prev")}</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                    ))}
                    <button className="page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>{t("Next")}</button>
                </div>
            </div>
        </>
    )
}

export default Pagination