import React from 'react'

const ToggleBTN = ({ clientId, isTrusted, onToggle }) => {
    return (
        <>
            <style>{`
                .custom-toggle.form-check-input:checked {
                    background-color: #d12026;
                    border-color: #d12026;
                }
                .custom-toggle.form-check-input:focus {
                    border-color: #d12026;
                    box-shadow: 0 0 0 0.25rem rgba(209, 32, 38, 0.25);
                }
            `}</style>

            <div className="form-check form-switch mb-0">
                <input
                    className="form-check-input custom-toggle"
                    type="checkbox"
                    role="switch"
                    checked={!!isTrusted}
                    onChange={(e) => onToggle(clientId, e.target.checked)}
                    style={{ cursor: "pointer", width: "40px", height: "20px" }}
                />
            </div>
        </>
    )
}

export default ToggleBTN