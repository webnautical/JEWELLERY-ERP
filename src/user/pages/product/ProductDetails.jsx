import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Mock — replace with actual API call
const getMockProduct = (id) => ({
  id, name: 'Gold Necklace Set', sku: 'SKU-GO1001', category: 'Gold',
  purity: '22K', weight: '18.5g', price: 42500, making: 3200, gst: 3,
  stock: 12, minStock: 3, status: 'Active', hallmark: 'Yes',
  gender: 'Women', occasion: 'Wedding', description: 'Elegant 22K gold necklace set with intricate meenakari work. Comes with matching earrings. Ideal for wedding and festive occasions.',
  stoneType: 'Ruby', stoneWeight: '1.20', stoneColor: 'Deep Red',
  stoneCut: 'Oval', stoneSetting: 'Prong', noOfStones: 8, certLab: 'SGL',
  length: '42mm', width: '18mm', height: '4mm',
  size: 'Free Size', chainLength: '18"', clasp: 'Lobster Claw',
  packaging: 'Velvet Box', hsnCode: '7113', barcode: 'JW7113001',
  tags: ['bridal', 'wedding', 'gold', 'necklace'],
  added: '12/03/2024', lastUpdated: '02/01/2025',
  history: [
    { date: '02/01/2025', action: 'Stock Updated', by: 'Deepak', note: 'Stock: 8 → 12' },
    { date: '15/12/2024', action: 'Price Changed',  by: 'Deepak', note: '₹40,000 → ₹42,500' },
    { date: '12/03/2024', action: 'Product Added',  by: 'Deepak', note: 'Initial entry' },
  ],
})

const statusStyle = {
  'Active':       { background: '#e8f7ee', color: '#1a7a40', border: '1px solid #b6dfca' },
  'Inactive':     { background: '#f5f5f5', color: '#666',    border: '1px solid #ddd'    },
  'Low Stock':    { background: '#fff8e6', color: '#8a6200', border: '1px solid #f0d080' },
  'Out of Stock': { background: '#fdecea', color: '#9a1c1c', border: '1px solid #f0b8b8' },
}

const Row = ({ label, val, highlight }) => (
  <div className="d-flex py-2" style={{ borderBottom: '1px solid #f5edd8' }}>
    <span style={{ width: '180px', flexShrink: 0, color: '#9a7a40', fontSize: '13px' }}>{label}</span>
    <span style={{ color: highlight ? '#c9a84c' : '#2c1e00', fontWeight: highlight ? 700 : 500, fontSize: '13px' }}>{val || '—'}</span>
  </div>
)

const Section = ({ title, icon, children }) => (
  <div className="rounded-3 mb-3" style={{ background: '#fff', border: '1px solid #e8d9b0' }}>
    <div className="px-4 py-3 d-flex align-items-center gap-2"
      style={{ borderBottom: '1px solid #f0e4c0', background: '#fffaf0', borderRadius: '10px 10px 0 0' }}>
      <i className={`bi ${icon}`} style={{ color: '#c9a84c', fontSize: '14px' }}></i>
      <span style={{ color: '#3d2c00', fontWeight: 700, fontSize: '14px' }}>{title}</span>
    </div>
    <div className="px-4 py-3">{children}</div>
  </div>
)

const ProductDetails = () => {
  const navigate = useNavigate()
  const { id }   = useParams()
  const p        = getMockProduct(id)
  const [tab, setTab] = useState('overview')

  const totalMRP = Math.round((p.price + p.making) * (1 + p.gst / 100))

  const tabs = [
    { key: 'overview',  label: 'Overview',      icon: 'bi-info-circle-fill' },
    { key: 'pricing',   label: 'Pricing',        icon: 'bi-currency-rupee'  },
    { key: 'stone',     label: 'Stone & Dims',   icon: 'bi-gem'             },
    { key: 'history',   label: 'Activity Log',   icon: 'bi-clock-history'   },
  ]

  return (
    <div className="p-4" style={{ color: '#3d2c00' }}>

      {/* Header */}
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <button onClick={() => navigate('/dashboard/products')}
            style={{ background: '#fdf0cc', border: '1px solid #e8c96a', color: '#7a5c00',
                     borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px' }}>
            <i className="bi bi-arrow-left me-1"></i> Back
          </button>
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h4 className="fw-bold mb-0" style={{ color: '#2c1e00', fontSize: '20px' }}>
                <i className="bi bi-gem me-2" style={{ color: '#c9a84c' }}></i>
                {p.name}
              </h4>
              <span style={{ ...statusStyle[p.status], fontSize: '11px', fontWeight: 700,
                borderRadius: '20px', padding: '3px 12px' }}>{p.status}</span>
            </div>
            <p className="mb-0 mt-1" style={{ color: '#9a7a40', fontSize: '13px' }}>
              {p.id} &nbsp;·&nbsp; {p.sku} &nbsp;·&nbsp; Added: {p.added}
            </p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button onClick={() => navigate(`/dashboard/products/edit/${p.id}`)}
            style={{ background: '#fdf0cc', border: '1px solid #e8c96a', color: '#7a5c00',
                     borderRadius: '8px', padding: '7px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            <i className="bi bi-pencil-fill me-1"></i> Edit
          </button>
          <button style={{ background: '#fdecea', border: '1px solid #f0b8b8', color: '#9a1c1c',
                     borderRadius: '8px', padding: '7px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            <i className="bi bi-trash-fill me-1"></i> Delete
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row g-3 mb-3">
        {[
          { label: 'Selling Price', val: `₹${p.price.toLocaleString('en-IN')}`, icon: 'bi-tag-fill',          color: '#c9a84c' },
          { label: 'Total MRP',     val: `₹${totalMRP.toLocaleString('en-IN')}`,icon: 'bi-currency-rupee',    color: '#1a7a40' },
          { label: 'Stock',         val: p.stock,                                icon: 'bi-box-seam-fill',     color: p.stock < 5 ? '#c0392b' : '#1a4d8a' },
          { label: 'Weight',        val: p.weight,                               icon: 'bi-speedometer2',      color: '#7a3c00' },
        ].map(s => (
          <div className="col-6 col-md-3" key={s.label}>
            <div className="rounded-3 p-3 text-center"
              style={{ background: '#fff', border: '1px solid #e8d9b0' }}>
              <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: '20px' }}></i>
              <p className="mb-0 mt-1 fw-bold" style={{ color: '#2c1e00', fontSize: '18px' }}>{s.val}</p>
              <p className="mb-0" style={{ color: '#9a7a40', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="d-flex gap-1 mb-3 flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              padding: '7px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
              fontWeight: tab === t.key ? 600 : 400,
              background: tab === t.key ? 'linear-gradient(135deg,#c9a84c,#e8c96a)' : '#fff',
              border: tab === t.key ? 'none' : '1px solid #e8d9b0',
              color: tab === t.key ? '#fff' : '#7a5c00',
            }}>
            <i className={`bi ${t.icon} me-1`}></i>{t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ── */}
      {tab === 'overview' && (
        <>
          <Section title="Basic Information" icon="bi-info-circle-fill">
            <Row label="Product Name"  val={p.name} />
            <Row label="Category"      val={p.category} />
            <Row label="SKU"           val={p.sku} />
            <Row label="Purity / Karat" val={p.purity} />
            <Row label="Weight"        val={p.weight} />
            <Row label="Hallmark"      val={p.hallmark} />
            <Row label="Gender"        val={p.gender} />
            <Row label="Occasion"      val={p.occasion} />
            <Row label="Last Updated"  val={p.lastUpdated} />
          </Section>
          <Section title="Description" icon="bi-text-paragraph">
            <p style={{ color: '#5a4010', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{p.description}</p>
          </Section>
          <Section title="Tags" icon="bi-tags-fill">
            <div className="d-flex flex-wrap gap-2">
              {p.tags.map((t, i) => (
                <span key={i} style={{ background: '#fdf0cc', border: '1px solid #e8c96a',
                  color: '#7a5c00', fontSize: '12px', fontWeight: 600,
                  borderRadius: '20px', padding: '4px 14px' }}>{t}</span>
              ))}
            </div>
          </Section>
        </>
      )}

      {/* ── Tab: Pricing ── */}
      {tab === 'pricing' && (
        <Section title="Pricing & Stock Details" icon="bi-currency-rupee">
          <Row label="Selling Price"    val={`₹${p.price.toLocaleString('en-IN')}`} highlight />
          <Row label="Making Charges"   val={`₹${p.making.toLocaleString('en-IN')}`} />
          <Row label={`GST (${p.gst}%)`} val={`₹${Math.round((p.price + p.making) * p.gst / 100).toLocaleString('en-IN')}`} />
          <Row label="Total MRP"        val={`₹${totalMRP.toLocaleString('en-IN')}`} highlight />
          <Row label="Current Stock"    val={p.stock} />
          <Row label="Min Stock Alert"  val={p.minStock} />
          <Row label="GST Rate"         val={`${p.gst}%`} />
          <Row label="HSN Code"         val={p.hsnCode} />
          <Row label="Barcode"          val={p.barcode} />
        </Section>
      )}

      {/* ── Tab: Stone & Dims ── */}
      {tab === 'stone' && (
        <>
          <Section title="Stone Details" icon="bi-gem">
            <Row label="Stone Type"    val={p.stoneType} />
            <Row label="Stone Weight"  val={`${p.stoneWeight} ct`} />
            <Row label="Stone Color"   val={p.stoneColor} />
            <Row label="Stone Cut"     val={p.stoneCut} />
            <Row label="Setting Style" val={p.stoneSetting} />
            <Row label="No. of Stones" val={p.noOfStones} />
            <Row label="Certifying Lab" val={p.certLab} />
          </Section>
          <Section title="Dimensions & Packaging" icon="bi-rulers">
            <Row label="Length"        val={p.length} />
            <Row label="Width"         val={p.width} />
            <Row label="Height"        val={p.height} />
            <Row label="Size"          val={p.size} />
            <Row label="Chain Length"  val={p.chainLength} />
            <Row label="Clasp Type"    val={p.clasp} />
            <Row label="Packaging"     val={p.packaging} />
          </Section>
        </>
      )}

      {/* ── Tab: Activity Log ── */}
      {tab === 'history' && (
        <Section title="Activity Log" icon="bi-clock-history">
          <div style={{ position: 'relative', paddingLeft: '20px' }}>
            {/* vertical line */}
            <div style={{ position: 'absolute', left: '6px', top: '8px', bottom: '8px',
              width: '2px', background: '#f0e4c0', borderRadius: '2px' }} />
            {p.history.map((h, i) => (
              <div key={i} className="d-flex gap-3 mb-3" style={{ position: 'relative' }}>
                <div style={{
                  width: '14px', height: '14px', borderRadius: '50%',
                  background: i === 0 ? '#c9a84c' : '#e8d9b0',
                  border: '2px solid #fff', flexShrink: 0,
                  position: 'absolute', left: '-17px', top: '3px',
                  boxShadow: i === 0 ? '0 0 0 3px rgba(201,168,76,0.2)' : 'none',
                }} />
                <div className="rounded-3 p-3 flex-grow-1"
                  style={{ background: i === 0 ? '#fffaf0' : '#fdf8f0', border: '1px solid #f0e4c0' }}>
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-1">
                    <span style={{ fontWeight: 700, color: '#3d2c00', fontSize: '13px' }}>{h.action}</span>
                    <span style={{ color: '#9a7a40', fontSize: '11px' }}>{h.date}</span>
                  </div>
                  <p className="mb-0 mt-1" style={{ color: '#6b5020', fontSize: '12px' }}>
                    <i className="bi bi-person-fill me-1" style={{ color: '#c9a84c' }}></i>{h.by}
                    &nbsp;·&nbsp; {h.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

export default ProductDetails