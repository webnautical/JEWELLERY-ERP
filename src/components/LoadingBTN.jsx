import React from 'react'

const LoadingBTN = () => {
    return (
        <button className="btn btn-primary d-flex align-items-center gap-2"
            disabled={true}
        >
            <span className="spinner-border spinner-border-sm"
                role="status"
            ></span>
            Loading...
        </button>
    )
}

export default LoadingBTN