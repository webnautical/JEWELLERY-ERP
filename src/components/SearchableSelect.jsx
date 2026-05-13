import React, { useState, useRef, useEffect } from 'react'

const SearchableSelect = ({
    name,
    value,
    onChange,
    onBlur,
    options = [],
    error,
    placeholder = 'Select...',
    labelKey = 'label',
    valueKey = 'value',
    labelSeparator = ' - ',
    disabled = false
}) => {
    const [search, setSearch] = useState('')
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    const getLabel = (item) => {
        if (Array.isArray(labelKey)) {
            return labelKey.map(k => item?.[k]).filter(Boolean).join(labelSeparator)
        }
        return item?.[labelKey] ?? ''
    }

    const filtered = options.filter(item => {
        if (Array.isArray(labelKey)) {
            return labelKey.some(k => String(item?.[k] ?? '').toLowerCase().includes(search.toLowerCase()))
        }
        return String(item?.[labelKey] ?? '').toLowerCase().includes(search.toLowerCase())
    })

    const selected = options.find(item => String(item?.[valueKey]) === String(value))

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
                onBlur?.()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (item) => {
        onChange({ target: { name, value: item ? item[valueKey] : '' } })
        setSearch('')
        setOpen(false)
    }

    const handleClear = (e) => {
        e.stopPropagation()
        onChange({ target: { name, value: '' } })
        setSearch('')
    }

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <div
                className={`form-select ${error ? 'inp-error' : ''}`}
                style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.6 : 1
                }}
                onClick={() => !disabled && setOpen(prev => !prev)}
            >
                <span style={{ color: selected ? 'inherit' : '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selected ? getLabel(selected) : placeholder}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    {value && !disabled && (
                        <span onClick={handleClear} style={{ fontSize: 16, lineHeight: 1, color: '#999', padding: '0 2px' }}>×</span>
                    )}
                    <span style={{ fontSize: 10, color: '#999' }}>{open ? '▲' : '▼'}</span>
                </span>
            </div>

            {open && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 999,
                    background: '#fff', border: '1px solid #ddd', borderRadius: 6,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: 2
                }}>
                    <div style={{ padding: '8px 8px 4px' }}>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onClick={e => e.stopPropagation()}
                            style={{
                                width: '100%', padding: '6px 10px', border: '1px solid #ddd',
                                borderRadius: 4, fontSize: 13, outline: 'none', boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <ul style={{ maxHeight: 200, overflowY: 'auto', margin: 0, padding: 0, listStyle: 'none' }}>
                        <li
                            onClick={() => handleSelect(null)}
                            style={{ padding: '8px 12px', fontSize: 13, cursor: 'pointer', color: '#aaa' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            {placeholder}
                        </li>
                        {filtered.length > 0 ? filtered.map((item, idx) => (
                            <li
                                key={item?.[valueKey] ?? idx}
                                onClick={() => handleSelect(item)}
                                style={{
                                    padding: '8px 12px', fontSize: 13, cursor: 'pointer',
                                    background: String(value) === String(item?.[valueKey]) ? '#f0f4ff' : 'transparent',
                                    fontWeight: String(value) === String(item?.[valueKey]) ? 500 : 400
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                                onMouseLeave={e => e.currentTarget.style.background = String(value) === String(item?.[valueKey]) ? '#f0f4ff' : 'transparent'}
                            >
                                {getLabel(item)}
                            </li>
                        )) : (
                            <li style={{ padding: '8px 12px', fontSize: 13, color: '#aaa' }}>No results found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default SearchableSelect