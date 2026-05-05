import React from 'react'

const LoadingBTN = ({className="btn btn-primary"}) => {
    return (
        <button className={className}  disabled={true}>
            <span className="spinner-border spinner-border-sm"
                role="status"
            ></span>
            Loading...
        </button>
    )
}

export default LoadingBTN