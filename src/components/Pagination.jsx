import React from 'react'
import { useTranslation } from '../helper/useTranslation'

const Pagination = ({ name, length, totalRecord, page, setPage, totalPages, limit, setLimit }) => {
    const { t } = useTranslation();

    const handleLimitChange = (e) => {
        const val = e.target.value
        setLimit(val === 'all' ? totalRecord : Number(val))
        setPage(1)
    }

    return (
        <div className="pagination">
            <div className="page-info">
                {t("Showing")} {length} {t("of")} {totalRecord} {t(name)}
            </div>

            <div className='d-flex gap-3'>
                {setLimit && (
                    <div className="page-limit">
                        <select className="filter-select" value={limit === totalRecord ? 'all' : limit} onChange={handleLimitChange}>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value="all">{t("All")}</option>
                        </select>
                    </div>
                )}


                <div className="page-btns">
                    <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                        {t("Prev")}
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>
                            {p}
                        </button>
                    ))}

                    <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                        {t("Next")}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Pagination