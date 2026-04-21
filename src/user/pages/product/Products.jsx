import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Sample Data ───────────────────────────────────────────────
const ALL_PRODUCTS = Array.from({ length: 47 }, (_, i) => {
    const categories = ['Gold', 'Silver', 'Diamond', 'Kundan', 'Polki', 'Platinum']
    const names = [
        'Necklace Set', 'Bangles Set', 'Earrings', 'Ring', 'Maang Tikka',
        'Anklet', 'Nose Pin', 'Pendant Set', 'Bracelet', 'Haar Set',
    ]
    const cat = categories[i % categories.length]
    const name = names[i % names.length]
    const price = Math.floor(Math.random() * 180000) + 2000
    const stock = Math.floor(Math.random() * 50)
    const statuses = ['Active', 'Active', 'Active', 'Inactive', 'Low Stock']
    return {
        id: `JW-${1000 + i + 1}`,
        name: `${cat} ${name}`,
        category: cat,
        price,
        stock,
        weight: `${(Math.random() * 40 + 2).toFixed(1)}g`,
        status: stock === 0 ? 'Out of Stock' : stock < 5 ? 'Low Stock' : statuses[i % statuses.length],
        sku: `SKU-${cat.substring(0, 2).toUpperCase()}${1000 + i}`,
        added: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}/0${(i % 9) + 1}/2024`,
    }
})

const CATEGORIES = ['All', 'Gold', 'Silver', 'Diamond', 'Kundan', 'Polki', 'Platinum']
const STATUSES = ['All', 'Active', 'Inactive', 'Low Stock', 'Out of Stock']
const PER_PAGE = 10

// ─── Status Badge ──────────────────────────────────────────────
const statusStyle = {
    'Active': { background: '#e8f7ee', color: '#1a7a40', border: '1px solid #b6dfca' },
    'Inactive': { background: '#f5f5f5', color: '#666', border: '1px solid #ddd' },
    'Low Stock': { background: '#fff8e6', color: '#8a6200', border: '1px solid #f0d080' },
    'Out of Stock': { background: '#fdecea', color: '#9a1c1c', border: '1px solid #f0b8b8' },
}

// ─── Context Menu ──────────────────────────────────────────────
const MENU_ITEMS = [
    { icon: 'bi-eye-fill', label: 'View Details', color: '#1a4d8a' },
    { icon: 'bi-pencil-fill', label: 'Edit Product', color: '#7a5c00' },
    { icon: 'bi-arrow-repeat', label: 'Update Stock', color: '#1a7a40' },
    { icon: 'bi-tag-fill', label: 'Change Price', color: '#7a3c00' },
    { icon: 'bi-toggle-on', label: 'Toggle Status', color: '#5a3a8a' },
    { icon: 'bi-files', label: 'Duplicate', color: '#2a6a6a' },
    { icon: 'bi-printer-fill', label: 'Print Label', color: '#444' },
    { divider: true },
    { icon: 'bi-trash-fill', label: 'Delete Product', color: '#c0392b', danger: true },
]

const Products = () => {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [status, setStatus] = useState('All')
    const [sortBy, setSortBy] = useState('id')
    const [sortDir, setSortDir] = useState('asc')
    const [page, setPage] = useState(1)
    const [selected, setSelected] = useState([])
    const [ctxMenu, setCtxMenu] = useState(null)   // { x, y, product }
    const [toast, setToast] = useState(null)
    const ctxRef = useRef(null)

    // ── Filter + Sort ─────────────────────────────────────────────
    const filtered = ALL_PRODUCTS
        .filter(p => {
            const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.sku.toLowerCase().includes(search.toLowerCase()) ||
                p.id.toLowerCase().includes(search.toLowerCase())
            const matchCat = category === 'All' || p.category === category
            const matchStatus = status === 'All' || p.status === status
            return matchSearch && matchCat && matchStatus
        })
        .sort((a, b) => {
            let va = a[sortBy], vb = b[sortBy]
            if (sortBy === 'price' || sortBy === 'stock') { va = +va; vb = +vb }
            else { va = String(va).toLowerCase(); vb = String(vb).toLowerCase() }
            return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
        })

    const totalPages = Math.ceil(filtered.length / PER_PAGE)
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    // ── Sort toggle ───────────────────────────────────────────────
    const handleSort = col => {
        if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortBy(col); setSortDir('asc') }
    }
    const SortIcon = ({ col }) => (
        <i className={`bi ms-1 ${sortBy === col ? (sortDir === 'asc' ? 'bi-sort-up' : 'bi-sort-down') : 'bi-arrow-down-up'}`}
            style={{ fontSize: '11px', opacity: sortBy === col ? 1 : 0.35 }} />
    )

    // ── Select ────────────────────────────────────────────────────
    const toggleSelect = id =>
        setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
    const toggleAll = () =>
        setSelected(s => s.length === paginated.length ? [] : paginated.map(p => p.id))

    const handleContextMenu = (e, product) => {
        e.preventDefault()

        const MENU_HEIGHT = 290  // approximate menu height
        const MENU_WIDTH = 200

        const spaceBelow = window.innerHeight - e.clientY
        const spaceRight = window.innerWidth - e.clientX

        const y = spaceBelow < MENU_HEIGHT ? e.clientY - MENU_HEIGHT : e.clientY
        const x = spaceRight < MENU_WIDTH ? e.clientX - MENU_WIDTH : e.clientX

        setCtxMenu({ x, y, product })
    }

    const handleMenuAction = (label, product) => {
        if (label === 'View Details') navigate(`/dashboard/products/${product.id}`)
        if (label === 'Edit Product') navigate(`/dashboard/products/edit/${product.id}`)
        else showToast(`${label}: ${product.name}`)
        setCtxMenu(null)
    }

    useEffect(() => {
        const close = e => {
            if (ctxRef.current && !ctxRef.current.contains(e.target)) setCtxMenu(null)
        }
        document.addEventListener('mousedown', close)
        return () => document.removeEventListener('mousedown', close)
    }, [])

    // ── Toast ─────────────────────────────────────────────────────
    const showToast = msg => {
        setToast(msg)
        setTimeout(() => setToast(null), 2800)
    }

    // ── Reset page on filter change ───────────────────────────────
    useEffect(() => setPage(1), [search, category, status])

    // ── Price formatter ───────────────────────────────────────────
    const fmt = n => '₹' + Number(n).toLocaleString('en-IN')

    return (
        <div className="p-4" style={{ color: '#3d2c00', position: 'relative' }}>

            {/* ── Page Header ─────────────────────────────────────── */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#2c1e00', fontSize: '22px' }}>
                        <i className="bi bi-gem me-2" style={{ color: '#c9a84c' }}></i>
                        Products
                    </h4>
                    <p className="mb-0" style={{ color: '#9a7a40', fontSize: '13px' }}>
                        {filtered.length} products found
                        {selected.length > 0 && <span className="ms-2" style={{ color: '#c9a84c', fontWeight: 600 }}>· {selected.length} selected</span>}
                    </p>
                </div>
                <div className="d-flex gap-2">
                    {selected.length > 0 && (
                        <button className="btn btn-sm rounded-2"
                            style={{ background: '#fdecea', border: '1px solid #f0b8b8', color: '#9a1c1c', fontSize: '13px' }}>
                            <i className="bi bi-trash-fill me-1"></i> Delete ({selected.length})
                        </button>
                    )}
                    <button className="btn btn-sm rounded-2"
                        style={{ background: '#fdf0cc', border: '1px solid #e8c96a', color: '#7a5c00', fontSize: '13px' }}>
                        <i className="bi bi-download me-1"></i> Export
                    </button>
                    <button className="btn btn-sm rounded-2 fw-semibold" onClick={() => navigate('/dashboard/products/add')}
                        style={{ background: 'linear-gradient(135deg,#c9a84c,#e8c96a)', border: 'none', color: '#fff', fontSize: '13px' }}>
                        <i className="bi bi-plus-lg me-1"></i> Add Product
                    </button>
                </div>
            </div>

            {/* ── Master Filters ─────────────────────────────────── */}
            <div className="rounded-3 mb-3" style={{ background: '#fff', border: '1px solid #e8d9b0' }}>

                {/* Filter Header */}
                <div className="d-flex align-items-center justify-content-between px-3 py-2"
                    style={{ borderBottom: '1px solid #f0e4c0', background: '#fffaf0', borderRadius: '10px 10px 0 0' }}>
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-funnel-fill" style={{ color: '#c9a84c', fontSize: '13px' }}></i>
                        <span style={{ color: '#5a4010', fontSize: '13px', fontWeight: 600 }}>Filters</span>
                        {/* Active filter count badge */}
                        {(search || category !== 'All' || status !== 'All') && (
                            <span className="jw-badge-gold">
                                {[search, category !== 'All', status !== 'All'].filter(Boolean).length} active
                            </span>
                        )}
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                        {(search || category !== 'All' || status !== 'All') && (
                            <button className="jw-btn-reset" onClick={() => { setSearch(''); setCategory('All'); setStatus('All') }}>
                                <i className="bi bi-x-circle me-1"></i> Reset All
                            </button>
                        )}
                        <button className="jw-btn-apply">
                            <i className="bi bi-check2 me-1"></i> Apply
                        </button>
                    </div>
                </div>

                {/* Filter Body */}
                <div className="p-3">
                    <div className="row g-2">

                        {/* Search */}
                        <div className="col-12 col-md-4 col-xl-3">
                            <label className="jw-filter-label">Search</label>
                            <div className="jw-input-wrap">
                                <i className="bi bi-search jw-input-icon"></i>
                                <input type="text" className="jw-input" placeholder="Name, SKU, ID..."
                                    value={search} onChange={e => setSearch(e.target.value)} />
                                {search && (
                                    <button className="jw-input-clear" onClick={() => setSearch('')}>
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category */}
                        <div className="col-6 col-md-2 col-xl-2">
                            <label className="jw-filter-label">Category</label>
                            <select className="jw-select" value={category} onChange={e => setCategory(e.target.value)}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Status */}
                        <div className="col-6 col-md-2 col-xl-2">
                            <label className="jw-filter-label">Status</label>
                            <select className="jw-select" value={status} onChange={e => setStatus(e.target.value)}>
                                {STATUSES.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>

                        {/* Date Range */}
                        <div className="col-6 col-md-2 col-xl-2">
                            <label className="jw-filter-label">Date From</label>
                            <div className="jw-input-wrap">
                                <i className="bi bi-calendar3 jw-input-icon"></i>
                                <input type="date" className="jw-input" />
                            </div>
                        </div>
                        <div className="col-6 col-md-2 col-xl-2">
                            <label className="jw-filter-label">Date To</label>
                            <div className="jw-input-wrap">
                                <i className="bi bi-calendar3 jw-input-icon"></i>
                                <input type="date" className="jw-input" />
                            </div>
                        </div>

                        {/* Stock Range */}
                        <div className="col-6 col-md-2 col-xl-1">
                            <label className="jw-filter-label">Stock Min</label>
                            <input type="number" className="jw-input" placeholder="0" min="0" />
                        </div>
                        <div className="col-6 col-md-2 col-xl-1">
                            <label className="jw-filter-label">Stock Max</label>
                            <input type="number" className="jw-input" placeholder="999" min="0" />
                        </div>

                        {/* Price Range */}
                        <div className="col-6 col-md-2 col-xl-2">
                            <label className="jw-filter-label">Price Min (₹)</label>
                            <div className="jw-input-wrap">
                                <i className="bi bi-currency-rupee jw-input-icon"></i>
                                <input type="number" className="jw-input" placeholder="0" min="0" />
                            </div>
                        </div>
                        <div className="col-6 col-md-2 col-xl-2">
                            <label className="jw-filter-label">Price Max (₹)</label>
                            <div className="jw-input-wrap">
                                <i className="bi bi-currency-rupee jw-input-icon"></i>
                                <input type="number" className="jw-input" placeholder="500000" min="0" />
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="col-6 col-md-2 col-xl-2">
                            <label className="jw-filter-label">Sort By</label>
                            <select className="jw-select"
                                value={`${sortBy}-${sortDir}`}
                                onChange={e => { const [col, dir] = e.target.value.split('-'); setSortBy(col); setSortDir(dir) }}>
                                <option value="id-asc">ID: A → Z</option>
                                <option value="name-asc">Name: A → Z</option>
                                <option value="name-desc">Name: Z → A</option>
                                <option value="price-asc">Price: Low → High</option>
                                <option value="price-desc">Price: High → Low</option>
                                <option value="stock-asc">Stock: Low → High</option>
                                <option value="stock-desc">Stock: High → Low</option>
                            </select>
                        </div>

                        {/* Weight */}
                        <div className="col-6 col-md-2 col-xl-2">
                            <label className="jw-filter-label">Weight (g)</label>
                            <select className="jw-select">
                                <option>All Weights</option>
                                <option>0 – 5g</option>
                                <option>5 – 15g</option>
                                <option>15 – 30g</option>
                                <option>30g+</option>
                            </select>
                        </div>

                        {/* Per Page */}
                        <div className="col-6 col-md-2 col-xl-2">
                            <label className="jw-filter-label">Per Page</label>
                            <select className="jw-select">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                                <option>100</option>
                            </select>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── Table ───────────────────────────────────────────── */}
            <div className="rounded-3 overflow-hidden"
                style={{ background: '#fff', border: '1px solid #e8d9b0', boxShadow: '0 1px 4px rgba(180,140,60,0.07)' }}>

                <div className="table-responsive">
                    <table className="table table-borderless mb-0" style={{ userSelect: 'none' }}>
                        <thead style={{ background: '#fffaf0', borderBottom: '1px solid #efe0b8' }}>
                            <tr>
                                <th className="px-3 py-3" style={{ width: '40px' }}>
                                    <input type="checkbox" className="form-check-input"
                                        checked={selected.length === paginated.length && paginated.length > 0}
                                        onChange={toggleAll}
                                        style={{ accentColor: '#c9a84c', cursor: 'pointer' }} />
                                </th>
                                {[
                                    { col: 'id', label: 'ID' },
                                    { col: 'name', label: 'Product' },
                                    { col: 'category', label: 'Category' },
                                    { col: 'sku', label: 'SKU' },
                                    { col: 'price', label: 'Price' },
                                    { col: 'stock', label: 'Stock' },
                                    { col: 'weight', label: 'Weight' },
                                    { col: 'status', label: 'Status' },
                                    { col: 'added', label: 'Added' },
                                ].map(({ col, label }) => (
                                    <th key={col}
                                        className="px-3 py-3"
                                        style={{
                                            color: '#b0986a', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
                                            textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap'
                                        }}
                                        onClick={() => handleSort(col)}>
                                        {label}<SortIcon col={col} />
                                    </th>
                                ))}
                                <th className="px-3 py-3" style={{ color: '#b0986a', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-5" style={{ color: '#b0986a' }}>
                                        <i className="bi bi-search d-block mb-2" style={{ fontSize: '28px', color: '#e8d9b0' }}></i>
                                        No products found
                                    </td>
                                </tr>
                            ) : paginated.map((p, i) => (
                                <tr key={p.id}
                                    onContextMenu={e => handleContextMenu(e, p)}
                                    style={{
                                        borderBottom: i < paginated.length - 1 ? '1px solid #f5edd8' : 'none',
                                        background: selected.includes(p.id) ? '#fffcf0' : 'transparent',
                                        transition: 'background 0.12s',
                                        cursor: 'context-menu',
                                    }}
                                    onMouseEnter={e => { if (!selected.includes(p.id)) e.currentTarget.style.background = '#fffdf5' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = selected.includes(p.id) ? '#fffcf0' : 'transparent' }}>

                                    <td className="px-3 py-3">
                                        <input type="checkbox" className="form-check-input"
                                            checked={selected.includes(p.id)}
                                            onChange={() => toggleSelect(p.id)}
                                            style={{ accentColor: '#c9a84c', cursor: 'pointer' }} />
                                    </td>
                                    <td className="px-3 py-3 fw-semibold" style={{ color: '#b8962e', fontSize: '13px' }}>{p.id}</td>
                                    <td className="px-3 py-3" style={{ color: '#2c1e00', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>{p.name}</td>
                                    <td className="px-3 py-3">
                                        <span className="rounded-pill px-2 py-1"
                                            style={{ background: '#fdf0cc', color: '#7a5c00', fontSize: '11px', fontWeight: 600, border: '1px solid #e8c96a' }}>
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3" style={{ color: '#6b5020', fontSize: '12px', fontFamily: 'monospace' }}>{p.sku}</td>
                                    <td className="px-3 py-3 fw-semibold" style={{ color: '#2c1e00', fontSize: '13px' }}>{fmt(p.price)}</td>
                                    <td className="px-3 py-3" style={{ color: p.stock < 5 ? '#c0392b' : '#3d2c00', fontSize: '13px', fontWeight: p.stock < 5 ? 600 : 400 }}>
                                        {p.stock}
                                    </td>
                                    <td className="px-3 py-3" style={{ color: '#6b5020', fontSize: '13px' }}>{p.weight}</td>
                                    <td className="px-3 py-3">
                                        <span className="rounded-pill px-3 py-1"
                                            style={{ fontSize: '11px', fontWeight: 600, ...statusStyle[p.status] }}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3" style={{ color: '#9a7a40', fontSize: '12px' }}>{p.added}</td>
                                    <td className="px-3 py-3">
                                        <div className="d-flex gap-1">
                                            <button className="btn btn-sm rounded-2 p-1 px-2"
                                                style={{ background: '#e8f0fb', border: '1px solid #bad0f0', color: '#1a4d8a', fontSize: '12px' }}
                                                title="View" onClick={() => navigate(`/dashboard/products/${p.id}`)}>
                                                <i className="bi bi-eye-fill"></i>
                                            </button>
                                            <button className="btn btn-sm rounded-2 p-1 px-2"
                                                style={{ background: '#fdf0cc', border: '1px solid #e8c96a', color: '#7a5c00', fontSize: '12px' }}
                                                title="Edit" onClick={() => showToast(`Edit: ${p.name}`)}>
                                                <i className="bi bi-pencil-fill"></i>
                                            </button>
                                            <button className="btn btn-sm rounded-2 p-1 px-2"
                                                style={{ background: '#fdecea', border: '1px solid #f0b8b8', color: '#9a1c1c', fontSize: '12px' }}
                                                title="Delete" onClick={() => showToast(`Delete: ${p.name}`)}>
                                                <i className="bi bi-trash-fill"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ─────────────────────────────────────── */}
                <div className="d-flex align-items-center justify-content-between px-4 py-3 flex-wrap gap-2"
                    style={{ borderTop: '1px solid #efe0b8', background: '#fffcf2' }}>
                    <p className="mb-0" style={{ color: '#9a7a40', fontSize: '13px' }}>
                        Showing <strong style={{ color: '#5a4010' }}>{(page - 1) * PER_PAGE + 1}</strong>–
                        <strong style={{ color: '#5a4010' }}>{Math.min(page * PER_PAGE, filtered.length)}</strong> of{' '}
                        <strong style={{ color: '#5a4010' }}>{filtered.length}</strong> products
                    </p>

                    <div className="d-flex align-items-center gap-1">
                        <button className="btn btn-sm rounded-2"
                            disabled={page === 1}
                            onClick={() => setPage(1)}
                            style={{
                                background: page === 1 ? '#f5edd8' : '#fdf0cc', border: '1px solid #e8c96a',
                                color: page === 1 ? '#c9a84c' : '#7a5c00', fontSize: '12px', opacity: page === 1 ? 0.5 : 1
                            }}>
                            <i className="bi bi-chevron-double-left"></i>
                        </button>
                        <button className="btn btn-sm rounded-2"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            style={{
                                background: page === 1 ? '#f5edd8' : '#fdf0cc', border: '1px solid #e8c96a',
                                color: page === 1 ? '#c9a84c' : '#7a5c00', fontSize: '12px', opacity: page === 1 ? 0.5 : 1
                            }}>
                            <i className="bi bi-chevron-left"></i>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                            .reduce((acc, n, idx, arr) => {
                                if (idx > 0 && n - arr[idx - 1] > 1) acc.push('...')
                                acc.push(n); return acc
                            }, [])
                            .map((n, i) => n === '...'
                                ? <span key={`dots-${i}`} className="px-2" style={{ color: '#b0986a', fontSize: '13px' }}>…</span>
                                : <button key={n}
                                    onClick={() => setPage(n)}
                                    className="btn btn-sm rounded-2"
                                    style={{
                                        minWidth: '32px',
                                        background: page === n ? 'linear-gradient(135deg,#c9a84c,#e8c96a)' : '#fff',
                                        border: `1px solid ${page === n ? 'transparent' : '#e8d9b0'}`,
                                        color: page === n ? '#fff' : '#7a5c00',
                                        fontWeight: page === n ? 700 : 400,
                                        fontSize: '13px',
                                    }}>{n}</button>
                            )}

                        <button className="btn btn-sm rounded-2"
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            style={{
                                background: page === totalPages ? '#f5edd8' : '#fdf0cc', border: '1px solid #e8c96a',
                                color: page === totalPages ? '#c9a84c' : '#7a5c00', fontSize: '12px', opacity: page === totalPages ? 0.5 : 1
                            }}>
                            <i className="bi bi-chevron-right"></i>
                        </button>
                        <button className="btn btn-sm rounded-2"
                            disabled={page === totalPages}
                            onClick={() => setPage(totalPages)}
                            style={{
                                background: page === totalPages ? '#f5edd8' : '#fdf0cc', border: '1px solid #e8c96a',
                                color: page === totalPages ? '#c9a84c' : '#7a5c00', fontSize: '12px', opacity: page === totalPages ? 0.5 : 1
                            }}>
                            <i className="bi bi-chevron-double-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Right-Click Context Menu ────────────────────────── */}
            {ctxMenu && (
                <div ref={ctxRef}
                    style={{
                        position: 'fixed',
                        top: ctxMenu.y, left: ctxMenu.x,
                        background: '#fff',
                        border: '1px solid #e8d9b0',
                        borderRadius: '10px',
                        boxShadow: '0 8px 24px rgba(180,140,60,0.18)',
                        minWidth: '195px',
                        zIndex: 9999,
                        overflow: 'hidden',
                        padding: '4px 0',
                        maxHeight: '320px',
                        overflowY: 'auto',
                    }}>

                    {/* Header */}
                    <div className="px-3 py-2" style={{ borderBottom: '1px solid #f5edd8', background: '#fffaf0' }}>
                        <p className="mb-0 fw-semibold" style={{ fontSize: '12px', color: '#2c1e00' }}>
                            <i className="bi bi-gem me-1" style={{ color: '#c9a84c' }}></i>
                            {ctxMenu.product.name}
                        </p>
                        <p className="mb-0" style={{ fontSize: '11px', color: '#b0986a' }}>{ctxMenu.product.id} · {ctxMenu.product.sku}</p>
                    </div>

                    {MENU_ITEMS.map((item, i) =>
                        item.divider
                            ? <hr key={i} className="my-1 mx-0" style={{ borderColor: '#f5edd8', margin: 0 }} />
                            : <button key={i}
                                className="btn d-flex align-items-center gap-2 w-100 text-start rounded-0 px-3 py-2"
                                style={{
                                    fontSize: '13px',
                                    color: item.danger ? '#c0392b' : '#3d2c00',
                                    background: 'transparent',
                                    border: 'none',
                                    transition: 'background 0.1s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = item.danger ? '#fdecea' : '#fffaf0'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                onClick={() => handleMenuAction(item.label)}>
                                <i className={`bi ${item.icon}`} style={{ color: item.color, fontSize: '14px', width: '16px' }}></i>
                                {item.label}
                            </button>
                    )}
                </div>
            )}

            {/* ── Toast ──────────────────────────────────────────── */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '24px', right: '24px',
                    background: '#fff', border: '1px solid #e8d9b0',
                    borderLeft: '4px solid #c9a84c',
                    borderRadius: '10px', padding: '12px 18px',
                    boxShadow: '0 4px 16px rgba(180,140,60,0.15)',
                    zIndex: 9998, fontSize: '13px', color: '#3d2c00',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    animation: 'slideIn 0.2s ease',
                }}>
                    <i className="bi bi-check-circle-fill" style={{ color: '#c9a84c', fontSize: '16px' }}></i>
                    {toast}
                </div>
            )}

            <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    )
}

export default Products