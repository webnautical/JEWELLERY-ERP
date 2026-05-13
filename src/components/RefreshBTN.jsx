import React, { useState } from 'react'
import { useTranslation } from '../helper/useTranslation'

const RefreshBTN = ({ refetch }) => {
    const { t } = useTranslation()
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = async () => {
        if (isRefreshing) return
        setIsRefreshing(true)
        try {
            await refetch()
        } finally {
            setIsRefreshing(false)
        }
    }

    return (
        <button type="button" className="btn btn-primary" onClick={handleRefresh} disabled={isRefreshing}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ marginRight: 6, ...(isRefreshing && { animation: 'spin 0.7s linear infinite' }) }}>
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.36-3.36L23 10M1 14l5.13 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {isRefreshing ? (t('refreshing') || 'Refreshing...') : t('refresh')}
        </button>
    )
}

export default RefreshBTN