import React, { useState, useRef, useEffect } from 'react'
import * as XLSX from 'xlsx'
import LoadingBTN from './../../components/LoadingBTN';

const ImportExportBTN = ({ data = [], fileName = 'export', isImport = true, isExport = true, onImport, displayKeys = [] }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const modalRef = useRef(null)
  const bsModalRef = useRef(null)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState(null)
  const [importResult, setImportResult] = useState(null)

  useEffect(() => {
    if (modalRef.current) {
      bsModalRef.current = new window.bootstrap.Modal(modalRef.current, {
        backdrop: true,
        keyboard: true,
      })

      // Clean up file state when modal is hidden via backdrop/ESC
      modalRef.current.addEventListener('hidden.bs.modal', () => {
        removeFile()
        setImporting(false)
        setImportResult(null)
      })
    }

    return () => {
      bsModalRef.current?.dispose()
    }
  }, [])

  const openModal = () => bsModalRef.current?.show()
  const closeModal = () => bsModalRef.current?.hide()

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, `${fileName}.xlsx`)
  }

  const setFile = (file) => {
    if (!file) return
    setSelectedFile(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
    setImportError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true) }
  const handleDragLeave = () => setIsDragOver(false)
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setFile(file)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) setFile(file)
  }

  const handleImport = async () => {
    if (!selectedFile) return
    setImporting(true)
    setImportError(null)
    setImportResult(null)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const result = await onImport?.(formData)
      setImportResult(result)
      removeFile()
    } catch (err) {
      const msg =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        'Something went wrong. Please try again.'
      setImportError(msg)
    } finally {
      setImporting(false)
    }
  }

  const formatSize = (bytes) => {
    const kb = bytes / 1024
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`
  }

  console.log("importResult", importResult)

  return (
    <>
      {/* Buttons */}
      {
        isImport &&
        <button
          className="btn d-flex align-items-center gap-2 text-white"
          style={{ background: '#217346', borderColor: '#217346' }}
          onClick={openModal}
        >
          <i className="bi bi-file-earmark-excel"></i>
          Import Excel
        </button>
      }

      {
        isExport &&
        <button
          className="btn d-flex align-items-center gap-2 text-white"
          style={{ background: '#1D6F42', borderColor: '#1D6F42' }}
          onClick={handleExport}
        >
          <i className="bi bi-file-earmark-excel"></i>
          Export Excel
        </button>
      }

      <div className="modal fade" ref={modalRef} tabIndex="-1" aria-labelledby="importModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 500 }}>
          <div className="modal-content border-0 rounded-3 shadow">

            {/* Header */}
            <div className="modal-header border-bottom py-3 px-4">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: 32, height: 32, background: '#E1F5EE' }}
                >
                  <i className="bi bi-file-earmark-excel" style={{ color: '#0F6E56', fontSize: 16 }}></i>
                </div>
                <h6 className="modal-title mb-0 fw-semibold" id="importModalLabel">Import Excel file</h6>
              </div>
              <button type="button" className="btn-close" onClick={closeModal} aria-label="Close" />
            </div>

            {/* Body */}
            <div className="modal-body p-4">
              {!importResult ? (
                <>
                  {/* Drop Zone */}
                  <div
                    className="position-relative rounded-3 text-center py-4 px-3"
                    style={{
                      border: `1.5px dashed ${isDragOver ? '#217346' : '#dee2e6'}`,
                      background: isDragOver ? 'rgba(33,115,70,0.04)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'border-color .15s, background .15s'
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="d-none"
                      onChange={handleFileSelect}
                    />
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3 mx-auto mb-3"
                      style={{ width: 44, height: 44, background: '#E1F5EE' }}
                    >
                      <i className="bi bi-cloud-upload" style={{ color: '#0F6E56', fontSize: 20 }}></i>
                    </div>
                    <p className="fw-semibold mb-1" style={{ fontSize: 14 }}>Drop your file here</p>
                    <p className="text-muted mb-0" style={{ fontSize: 12 }}>
                      or <span style={{ color: '#217346', fontWeight: 500 }}>browse to upload</span>
                      {' '}· .xlsx, .xls, .csv
                    </p>
                  </div>

                  {/* File Preview */}
                  {selectedFile && (
                    <div
                      className="d-flex align-items-center gap-3 mt-3 p-3 rounded-3"
                      style={{ background: '#f8f9fa', border: '0.5px solid #dee2e6' }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                        style={{ width: 36, height: 36, background: '#E1F5EE' }}
                      >
                        <i className="bi bi-file-earmark-excel" style={{ color: '#0F6E56', fontSize: 16 }}></i>
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <p className="mb-0 fw-semibold text-truncate" style={{ fontSize: 13 }}>{selectedFile.name}</p>
                        <p className="mb-0 text-muted" style={{ fontSize: 11 }}>{formatSize(selectedFile.size)}</p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-danger p-0"
                        onClick={(e) => { e.stopPropagation(); removeFile() }}
                      >
                        <i className="bi bi-x-lg" style={{ fontSize: 13 }}></i>
                      </button>
                    </div>
                  )}

                  {/* Error */}
                  {importError && (
                    <div
                      className="d-flex align-items-start gap-2 mt-3 p-3 rounded-3"
                      style={{ background: '#FFF2F2', border: '0.5px solid #FFCDD2' }}
                    >
                      <i className="bi bi-exclamation-circle-fill mt-1" style={{ color: '#D32F2F', fontSize: 14, flexShrink: 0 }}></i>
                      <p className="mb-0" style={{ fontSize: 12, color: '#B71C1C' }}>{importError}</p>
                    </div>
                  )}
                </>
              ) : (
                /* ✅ Result View */
                <div>
                  {/* Summary Header */}
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{ width: 36, height: 36, background: '#E1F5EE' }}
                    >
                      <i className="bi bi-check-lg" style={{ color: '#0F6E56', fontSize: 18 }}></i>
                    </div>
                    <div>
                      <p className="mb-0 fw-semibold" style={{ fontSize: 14 }}>Import Complete</p>
                      <p className="mb-0 text-muted" style={{ fontSize: 12 }}>{importResult.message}</p>
                    </div>
                  </div>

                  {/* Stats Pills */}
                  <div className="d-flex gap-2 mb-3 flex-wrap">
                    <span
                      className="px-3 py-1 rounded-pill fw-semibold"
                      style={{ fontSize: 12, background: '#E1F5EE', color: '#0F6E56' }}
                    >
                      <i className="bi bi-check2 me-1"></i>{importResult.inserted_count} Inserted
                    </span>
                    {importResult.failed_count > 0 && (
                      <span
                        className="px-3 py-1 rounded-pill fw-semibold"
                        style={{ fontSize: 12, background: '#FFF2F2', color: '#D32F2F' }}
                      >
                        <i className="bi bi-x me-1"></i>{importResult.failed_count} Failed
                      </span>
                    )}
                    <span
                      className="px-3 py-1 rounded-pill fw-semibold"
                      style={{ fontSize: 12, background: '#f0f0f0', color: '#555' }}
                    >
                      Total: {importResult.total}
                    </span>
                  </div>

                  {/* Inserted List */}
                  {importResult.inserted?.length > 0 && (
                    <div className="rounded-3 overflow-hidden" style={{ border: '0.5px solid #dee2e6' }}>
                      <div className="px-3 py-2" style={{ background: '#f8f9fa', borderBottom: '0.5px solid #dee2e6' }}>
                        <p className="mb-0 fw-semibold" style={{ fontSize: 12, color: '#444' }}>
                          <i className="bi bi-list-check me-1"></i>Inserted Records
                        </p>
                      </div>
                      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                        {importResult.inserted.map((item, i) => (
                          <div
                            key={i}
                            className="d-flex align-items-center gap-2 px-3 py-2 flex-wrap"
                            style={{ borderBottom: i < importResult.inserted.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}
                          >
                            {/* Row number — hamesha dikhao */}
                            <span
                              className="rounded-pill px-2 fw-semibold flex-shrink-0"
                              style={{ fontSize: 10, background: '#E1F5EE', color: '#0F6E56' }}
                            >
                              Row {item.row ?? i + 1}
                            </span>

                            {/* Sirf wahi keys dikhao jo pass ki hain */}
                            {displayKeys.map((key) =>
                              item[key] != null ? (
                                <span key={key} style={{ fontSize: 12, color: '#333' }}>
                                  {typeof item[key] === 'number'
                                    ? `₹${item[key].toLocaleString()}`  // number ho to ₹ lagao
                                    : item[key]
                                  }
                                </span>
                              ) : null
                            )}

                            {/* Agar koi displayKeys nahi diya to saari values dikhao */}
                            {displayKeys.length === 0 &&
                              Object.entries(item)
                                .filter(([k]) => !['id', 'row', 'assetId'].includes(k))
                                .map(([k, v]) => (
                                  <span key={k} style={{ fontSize: 12, color: '#333' }}>
                                    <span className="text-muted" style={{ fontSize: 10 }}>{k}: </span>{v}
                                  </span>
                                ))
                            }
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Failed List */}
                  {importResult.failed?.length > 0 && (
                    <div className="rounded-3 overflow-hidden mt-2" style={{ border: '0.5px solid #FFCDD2' }}>
                      <div className="px-3 py-2" style={{ background: '#FFF2F2', borderBottom: '0.5px solid #FFCDD2' }}>
                        <p className="mb-0 fw-semibold" style={{ fontSize: 12, color: '#D32F2F' }}>
                          <i className="bi bi-exclamation-triangle me-1"></i>Failed Records
                        </p>
                      </div>
                      <div style={{ maxHeight: 150, overflowY: 'auto' }}>
                        {importResult.failed.map((item, i) => (
                          <div
                            key={i}
                            className="d-flex align-items-center gap-2 px-3 py-2"
                            style={{ borderBottom: i < importResult.failed.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}
                          >
                            <i className="bi bi-x-circle-fill flex-shrink-0" style={{ color: '#D32F2F', fontSize: 12 }}></i>
                            <span style={{ fontSize: 12, color: '#B71C1C' }}>{item.style_code || item.row || `Row ${i + 1}`}</span>
                            {item.reason && (
                              <span className="text-muted text-truncate" style={{ fontSize: 12 }}>— {item.reason}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer border-top px-4 py-3">
              {!importResult ? (
                <>
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={closeModal}>
                    Cancel
                  </button>
                  {importing ? (
                    <LoadingBTN className='btn btn-sm btn-success' />
                  ) : (
                    <button
                      type="button"
                      className="btn btn-sm text-white d-flex align-items-center gap-2"
                      style={{ background: '#217346', borderColor: '#217346' }}
                      disabled={!selectedFile}
                      onClick={handleImport}
                    >
                      <i className="bi bi-upload"></i>
                      Import file
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-sm text-white px-4"
                  style={{ background: '#217346', borderColor: '#217346' }}
                  onClick={closeModal}
                >
                  <i className="bi bi-check2 me-1"></i>Done
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default ImportExportBTN