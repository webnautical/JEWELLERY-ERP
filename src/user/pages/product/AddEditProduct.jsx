import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const CATEGORIES = ['Gold', 'Silver', 'Diamond', 'Kundan', 'Polki', 'Platinum']
const PURITY     = ['24K', '22K', '18K', '14K', '925 Sterling', '999 Fine', 'N/A']
const OCCASIONS  = ['Wedding', 'Festival', 'Daily Wear', 'Party', 'Bridal', 'Gift']

const initialForm = {
  name: '', sku: '', category: '', purity: '', weight: '', price: '',
  stock: '', minStock: '', description: '', occasion: '', gender: 'Women',
  making: '', hallmark: 'Yes', gst: '3', status: 'Active',
  stoneType: '', stoneWeight: '', stoneColor: '',
  length: '', width: '', height: '',
  image1: null, image2: null, image3: null,
  tags: '',
}

const AddEditProduct = () => {
  const navigate     = useNavigate()
  const { id }       = useParams()
  const isEdit       = Boolean(id)
  const [form, setForm]   = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [saved, setSaved]   = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name     = 'Product name required'
    if (!form.sku.trim())      e.sku      = 'SKU required'
    if (!form.category)        e.category = 'Select category'
    if (!form.price)           e.price    = 'Price required'
    if (!form.stock && form.stock !== 0) e.stock = 'Stock required'
    if (!form.weight)          e.weight   = 'Weight required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setSaved(true)
    setTimeout(() => navigate('/dashboard/products'), 1500)
  }

  const tabs = [
    { key: 'basic',   label: 'Basic Info',    icon: 'bi-info-circle-fill'    },
    { key: 'pricing', label: 'Pricing & Stock', icon: 'bi-currency-rupee'    },
    { key: 'stone',   label: 'Stone Details', icon: 'bi-gem'                 },
    { key: 'dims',    label: 'Dimensions',    icon: 'bi-rulers'              },
    { key: 'media',   label: 'Media & Tags',  icon: 'bi-image-fill'          },
  ]

  const F = ({ label, req, error, children }) => (
    <div className="mb-3">
      <label className="jw-filter-label mb-1">
        {label}{req && <span style={{ color: '#c0392b', marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && <p className="mb-0 mt-1" style={{ color: '#c0392b', fontSize: '11px' }}>{error}</p>}
    </div>
  )

  const inputCls = (key) => ({
    width: '100%', height: '36px', padding: '0 12px',
    fontSize: '13px', color: '#3d2c00',
    background: errors[key] ? '#fff8f8' : '#fdf8ed',
    border: `1px solid ${errors[key] ? '#f0b8b8' : '#e8d9b0'}`,
    borderRadius: '8px', outline: 'none',
  })

  const selectCls = (key) => ({
    ...inputCls(key),
    appearance: 'none', cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16'%3E%3Cpath fill='%23c9a84c' d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
    paddingRight: '30px',
  })

  return (
    <div className="p-4" style={{ color: '#3d2c00' }}>

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <button onClick={() => navigate('/dashboard/products')}
            style={{ background: '#fdf0cc', border: '1px solid #e8c96a', color: '#7a5c00',
                     borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px' }}>
            <i className="bi bi-arrow-left me-1"></i> Back
          </button>
          <div>
            <h4 className="fw-bold mb-0" style={{ color: '#2c1e00', fontSize: '20px' }}>
              <i className="bi bi-gem me-2" style={{ color: '#c9a84c' }}></i>
              {isEdit ? `Edit Product — ${id}` : 'Add New Product'}
            </h4>
            <p className="mb-0" style={{ color: '#9a7a40', fontSize: '13px' }}>
              {isEdit ? 'Update product information' : 'Fill in the details to add a new jewellery product'}
            </p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button onClick={() => navigate('/dashboard/products')}
            style={{ background: '#fff', border: '1px solid #e8d9b0', color: '#5a4010',
                     borderRadius: '8px', padding: '7px 18px', cursor: 'pointer', fontSize: '13px' }}>
            Cancel
          </button>
          <button onClick={handleSubmit}
            style={{ background: 'linear-gradient(135deg,#c9a84c,#e8c96a)', border: 'none',
                     color: '#fff', borderRadius: '8px', padding: '7px 22px',
                     cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            <i className={`bi ${saved ? 'bi-check2' : 'bi-floppy-fill'} me-1`}></i>
            {saved ? 'Saved!' : isEdit ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-1 mb-3 flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{
              padding: '7px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
              fontWeight: activeTab === t.key ? 600 : 400,
              background: activeTab === t.key ? 'linear-gradient(135deg,#c9a84c,#e8c96a)' : '#fff',
              border: activeTab === t.key ? 'none' : '1px solid #e8d9b0',
              color: activeTab === t.key ? '#fff' : '#7a5c00',
            }}>
            <i className={`bi ${t.icon} me-1`}></i>{t.label}
          </button>
        ))}
      </div>

      {/* Form Card */}
      <div className="rounded-3 p-4" style={{ background: '#fff', border: '1px solid #e8d9b0' }}>

        {/* ── TAB: Basic Info ── */}
        {activeTab === 'basic' && (
          <div className="row g-3">
            <div className="col-md-6">
              <F label="Product Name" req error={errors.name}>
                <input style={inputCls('name')} placeholder="e.g. Gold Necklace Set"
                  value={form.name} onChange={e => set('name', e.target.value)} />
              </F>
            </div>
            <div className="col-md-3">
              <F label="SKU" req error={errors.sku}>
                <input style={inputCls('sku')} placeholder="e.g. SKU-GO1001"
                  value={form.sku} onChange={e => set('sku', e.target.value)} />
              </F>
            </div>
            <div className="col-md-3">
              <F label="Status">
                <select style={selectCls('status')} value={form.status} onChange={e => set('status', e.target.value)}>
                  {['Active','Inactive','Low Stock','Out of Stock'].map(s => <option key={s}>{s}</option>)}
                </select>
              </F>
            </div>
            <div className="col-md-4">
              <F label="Category" req error={errors.category}>
                <select style={selectCls('category')} value={form.category} onChange={e => set('category', e.target.value)}>
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </F>
            </div>
            <div className="col-md-4">
              <F label="Purity / Karat">
                <select style={selectCls('purity')} value={form.purity} onChange={e => set('purity', e.target.value)}>
                  <option value="">Select Purity</option>
                  {PURITY.map(p => <option key={p}>{p}</option>)}
                </select>
              </F>
            </div>
            <div className="col-md-2">
              <F label="Hallmark">
                <select style={selectCls('hallmark')} value={form.hallmark} onChange={e => set('hallmark', e.target.value)}>
                  <option>Yes</option><option>No</option>
                </select>
              </F>
            </div>
            <div className="col-md-2">
              <F label="Gender">
                <select style={selectCls('gender')} value={form.gender} onChange={e => set('gender', e.target.value)}>
                  <option>Women</option><option>Men</option><option>Unisex</option><option>Kids</option>
                </select>
              </F>
            </div>
            <div className="col-md-4">
              <F label="Occasion">
                <select style={selectCls('occasion')} value={form.occasion} onChange={e => set('occasion', e.target.value)}>
                  <option value="">Select Occasion</option>
                  {OCCASIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </F>
            </div>
            <div className="col-md-4">
              <F label="Weight (grams)" req error={errors.weight}>
                <input type="number" style={inputCls('weight')} placeholder="e.g. 12.5"
                  value={form.weight} onChange={e => set('weight', e.target.value)} />
              </F>
            </div>
            <div className="col-md-4">
              <F label="Making Charges (₹)">
                <input type="number" style={inputCls('making')} placeholder="e.g. 2500"
                  value={form.making} onChange={e => set('making', e.target.value)} />
              </F>
            </div>
            <div className="col-12">
              <F label="Description">
                <textarea style={{ ...inputCls('description'), height: '90px', padding: '10px 12px', resize: 'vertical' }}
                  placeholder="Product description, material details, special features..."
                  value={form.description} onChange={e => set('description', e.target.value)} />
              </F>
            </div>
          </div>
        )}

        {/* ── TAB: Pricing & Stock ── */}
        {activeTab === 'pricing' && (
          <div className="row g-3">
            <div className="col-md-4">
              <F label="Selling Price (₹)" req error={errors.price}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#c9a84c', fontSize:'13px' }}>₹</span>
                  <input type="number" style={{ ...inputCls('price'), paddingLeft: '24px' }}
                    placeholder="0" value={form.price} onChange={e => set('price', e.target.value)} />
                </div>
              </F>
            </div>
            <div className="col-md-4">
              <F label="Cost Price (₹)">
                <div style={{ position: 'relative' }}>
                  <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#c9a84c', fontSize:'13px' }}>₹</span>
                  <input type="number" style={{ ...inputCls('costPrice'), paddingLeft: '24px' }} placeholder="0" />
                </div>
              </F>
            </div>
            <div className="col-md-4">
              <F label="GST Rate (%)">
                <select style={selectCls('gst')} value={form.gst} onChange={e => set('gst', e.target.value)}>
                  <option value="0">0%</option>
                  <option value="3">3%</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                </select>
              </F>
            </div>
            <div className="col-md-4">
              <F label="Current Stock" req error={errors.stock}>
                <input type="number" style={inputCls('stock')} placeholder="0"
                  value={form.stock} onChange={e => set('stock', e.target.value)} />
              </F>
            </div>
            <div className="col-md-4">
              <F label="Min Stock Alert">
                <input type="number" style={inputCls('minStock')} placeholder="e.g. 5"
                  value={form.minStock} onChange={e => set('minStock', e.target.value)} />
              </F>
            </div>
            <div className="col-md-4">
              <F label="Max Stock">
                <input type="number" style={inputCls('maxStock')} placeholder="e.g. 100" />
              </F>
            </div>

            {/* Price summary box */}
            {form.price && (
              <div className="col-12">
                <div className="rounded-3 p-3" style={{ background: '#fffaf0', border: '1px solid #e8d9b0' }}>
                  <p className="mb-2 fw-semibold" style={{ color: '#5a4010', fontSize: '13px' }}>
                    <i className="bi bi-calculator me-1" style={{ color: '#c9a84c' }}></i> Price Breakdown
                  </p>
                  <div className="row g-2">
                    {[
                      { label: 'Base Price',    val: `₹${Number(form.price || 0).toLocaleString('en-IN')}` },
                      { label: 'Making Charges',val: `₹${Number(form.making || 0).toLocaleString('en-IN')}` },
                      { label: `GST (${form.gst}%)`, val: `₹${Math.round((Number(form.price||0)+Number(form.making||0)) * Number(form.gst||0) / 100).toLocaleString('en-IN')}` },
                      { label: 'Total MRP',     val: `₹${Math.round((Number(form.price||0)+Number(form.making||0)) * (1 + Number(form.gst||0)/100)).toLocaleString('en-IN')}`, bold: true },
                    ].map(item => (
                      <div className="col-6 col-md-3" key={item.label}>
                        <p className="mb-0" style={{ color: '#9a7a40', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{item.label}</p>
                        <p className="mb-0 fw-bold" style={{ color: item.bold ? '#c9a84c' : '#3d2c00', fontSize: item.bold ? '17px' : '14px' }}>{item.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Stone Details ── */}
        {activeTab === 'stone' && (
          <div className="row g-3">
            <div className="col-md-4">
              <F label="Stone Type">
                <select style={selectCls('stoneType')} value={form.stoneType} onChange={e => set('stoneType', e.target.value)}>
                  <option value="">None / No Stone</option>
                  {['Diamond','Ruby','Emerald','Sapphire','Pearl','Polki','Kundan','Moissanite','CZ'].map(s => <option key={s}>{s}</option>)}
                </select>
              </F>
            </div>
            <div className="col-md-4">
              <F label="Stone Weight (Carats)">
                <input type="number" style={inputCls('stoneWeight')} placeholder="e.g. 0.50"
                  value={form.stoneWeight} onChange={e => set('stoneWeight', e.target.value)} />
              </F>
            </div>
            <div className="col-md-4">
              <F label="Stone Color">
                <input style={inputCls('stoneColor')} placeholder="e.g. D-F Colorless"
                  value={form.stoneColor} onChange={e => set('stoneColor', e.target.value)} />
              </F>
            </div>
            <div className="col-md-4">
              <F label="Stone Clarity">
                <select style={selectCls()}>
                  <option>N/A</option>
                  {['FL','IF','VVS1','VVS2','VS1','VS2','SI1','SI2','I1','I2'].map(c => <option key={c}>{c}</option>)}
                </select>
              </F>
            </div>
            <div className="col-md-4">
              <F label="Stone Cut">
                <select style={selectCls()}>
                  <option>N/A</option>
                  {['Round Brilliant','Princess','Oval','Marquise','Pear','Cushion','Emerald Cut','Asscher'].map(c => <option key={c}>{c}</option>)}
                </select>
              </F>
            </div>
            <div className="col-md-4">
              <F label="Stone Setting">
                <select style={selectCls()}>
                  <option>N/A</option>
                  {['Prong','Bezel','Pave','Channel','Invisible','Flush','Tension'].map(s => <option key={s}>{s}</option>)}
                </select>
              </F>
            </div>
            <div className="col-md-4">
              <F label="No. of Stones">
                <input type="number" style={inputCls()} placeholder="e.g. 12" />
              </F>
            </div>
            <div className="col-md-4">
              <F label="Certificate No.">
                <input style={inputCls()} placeholder="GIA / IGI Cert No." />
              </F>
            </div>
            <div className="col-md-4">
              <F label="Certifying Lab">
                <select style={selectCls()}>
                  <option>N/A</option>
                  {['GIA','IGI','HRD','SGL','IGL'].map(l => <option key={l}>{l}</option>)}
                </select>
              </F>
            </div>
          </div>
        )}

        {/* ── TAB: Dimensions ── */}
        {activeTab === 'dims' && (
          <div className="row g-3">
            {[
              { label: 'Length (mm)', key: 'length' },
              { label: 'Width (mm)',  key: 'width'  },
              { label: 'Height (mm)', key: 'height' },
            ].map(d => (
              <div className="col-md-4" key={d.key}>
                <F label={d.label}>
                  <input type="number" style={inputCls(d.key)} placeholder="0.00"
                    value={form[d.key]} onChange={e => set(d.key, e.target.value)} />
                </F>
              </div>
            ))}
            <div className="col-md-4">
              <F label="Size / Ring Size">
                <input style={inputCls()} placeholder="e.g. 16, Free Size, 6 inch" />
              </F>
            </div>
            <div className="col-md-4">
              <F label="Clasp Type">
                <select style={selectCls()}>
                  <option>N/A</option>
                  {['Lobster Claw','Spring Ring','Toggle','Box Clasp','Magnetic','Hook & Eye'].map(c => <option key={c}>{c}</option>)}
                </select>
              </F>
            </div>
            <div className="col-md-4">
              <F label="Chain Length (inches)">
                <select style={selectCls()}>
                  <option>N/A</option>
                  {['14"','16"','18"','20"','22"','24"','30"'].map(l => <option key={l}>{l}</option>)}
                </select>
              </F>
            </div>
            <div className="col-md-4">
              <F label="Packaging">
                <select style={selectCls()}>
                  {['Gift Box','Pouch','Velvet Box','Zip Bag','Without Packaging'].map(p => <option key={p}>{p}</option>)}
                </select>
              </F>
            </div>
          </div>
        )}

        {/* ── TAB: Media & Tags ── */}
        {activeTab === 'media' && (
          <div className="row g-3">
            {[1, 2, 3].map(n => (
              <div className="col-md-4" key={n}>
                <F label={`Image ${n}${n === 1 ? ' (Primary)' : ''}`}>
                  <label style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', height: '120px', borderRadius: '10px',
                    border: '2px dashed #e8c96a', background: '#fffaf0', cursor: 'pointer',
                    fontSize: '12px', color: '#b0986a', gap: '8px',
                  }}>
                    <i className="bi bi-cloud-upload" style={{ fontSize: '24px', color: '#c9a84c' }}></i>
                    Click to upload
                    <input type="file" accept="image/*" style={{ display: 'none' }} />
                  </label>
                </F>
              </div>
            ))}
            <div className="col-12">
              <F label="Tags (comma separated)">
                <input style={inputCls('tags')} placeholder="e.g. bridal, wedding, necklace, gold"
                  value={form.tags} onChange={e => set('tags', e.target.value)} />
              </F>
              {form.tags && (
                <div className="d-flex flex-wrap gap-1 mt-2">
                  {form.tags.split(',').map(t => t.trim()).filter(Boolean).map((t, i) => (
                    <span key={i} style={{ background: '#fdf0cc', border: '1px solid #e8c96a',
                      color: '#7a5c00', fontSize: '11px', fontWeight: 600,
                      borderRadius: '20px', padding: '3px 10px' }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="col-md-6">
              <F label="HSN Code">
                <input style={inputCls()} placeholder="e.g. 7113" />
              </F>
            </div>
            <div className="col-md-6">
              <F label="Barcode / RFID">
                <input style={inputCls()} placeholder="Scan or enter barcode" />
              </F>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Save */}
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button onClick={() => navigate('/dashboard/products')}
          style={{ background: '#fff', border: '1px solid #e8d9b0', color: '#5a4010',
                   borderRadius: '8px', padding: '8px 22px', cursor: 'pointer', fontSize: '13px' }}>
          Cancel
        </button>
        <button onClick={handleSubmit}
          style={{ background: 'linear-gradient(135deg,#c9a84c,#e8c96a)', border: 'none',
                   color: '#fff', borderRadius: '8px', padding: '8px 28px',
                   cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
          <i className={`bi ${saved ? 'bi-check2' : 'bi-floppy-fill'} me-1`}></i>
          {saved ? 'Saved!' : isEdit ? 'Update Product' : 'Save Product'}
        </button>
      </div>
    </div>
  )
}

export default AddEditProduct