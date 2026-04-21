import CryptoJS from "crypto-js";
import Swal from 'sweetalert2';
export const IS_LIVE = false


export const imgBaseURL = () => {
    return IS_LIVE ? "" : "https://cattivo.itworkshop.in"
}

export const apiBaseURL = () => {
    return IS_LIVE ? "" : "https://cattivo.itworkshop.in/"
}

export const getRemainingDays = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);

    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

export const authUser = () => {
    if (localStorage.getItem("web-secret")) {
        return dycryptLocalStorageData(
            localStorage.getItem("web-secret"),
            "DoNotTryToAccess"
        );
    } else {
        return null;
    }
};

export const encryptLocalStorageData = (name, data, key) => {
    var encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    localStorage.setItem(name, encryptData);
};

export const dycryptLocalStorageData = (encryptData, key) => {
    var bytes = CryptoJS.AES.decrypt(encryptData, key);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
};

export const showSuccess = (message, title = 'Success', onConfirm = null) => {
    return Swal.fire({
        icon: 'success',
        title: title,
        text: message,
        confirmButtonColor: '#3085d6'
    }).then((result) => {
        if (onConfirm && result.isConfirmed) {
            onConfirm();
        }
        return result;
    });
};

export const showError = (message, title = 'Error') => {
    return Swal.fire({
        icon: 'error',
        title: title,
        text: message,
        confirmButtonColor: '#d33'
    });
};

export const showWarning = (message, title = 'Warning') => {
    return Swal.fire({
        icon: 'warning',
        title: title,
        text: message,
        confirmButtonColor: '#ffc107'
    });
};

export const showInfo = (message, title = 'Info') => {
    return Swal.fire({
        icon: 'info',
        title: title,
        text: message,
        confirmButtonColor: '#17a2b8'
    });
};

export const showConfirm = (message, title = 'Are you sure?') => {
    return Swal.fire({
        title: title,
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
    });
};

export const formatDate = (date, withTime = false) => {
    if (!date) return '';

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear());

    if (!withTime) {
        return `${day}-${month}-${year}`;
    }

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const shortText = (text = '', limit = 30) => {
    if (!text) return '-';

    const finalTest = text.length > limit
        ? text.substring(0, limit) + '...'
        : text

    return finalTest


};

const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();

    if (minutes < 10) {
        // Adding leading zero to minutes
        minutes = `0${minutes}`;
    }
    if (prefomattedDate) {
        // Today at 10:20
        // Yesterday at 10:20
        return `${prefomattedDate} at ${hours}:${minutes}`;
    }
    if (hideYear) {
        // 10. January at 10:20
        return `${day} ${month} at ${hours}:${minutes}`;
    }
    // 10. January 2017. at 10:20
    return `${day} ${month} ${year} at ${hours}:${minutes}`;
}

// --- Main function
export function timeAgo(dateParam) {
    if (!dateParam) {
        return null;
    }
    const date = typeof dateParam === "object" ? dateParam : new Date(dateParam);
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
    const today = new Date();
    const yesterday = new Date(today - DAY_IN_MS);
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = today.getFullYear() === date.getFullYear();

    if (seconds < 5) {
        return "just now";
    } else if (seconds < 60) {
        return `${seconds} seconds ago`;
    } else if (seconds < 90) {
        return "about a minute ago";
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (isToday) {
        return getFormattedDate(date, "Today"); // Today at 10:20
    } else if (isYesterday) {
        return getFormattedDate(date, "Yesterday"); // Yesterday at 10:20
    } else if (isThisYear) {
        return getFormattedDate(date, false, false); // 10. January at 10:20
    }

    return getFormattedDate(date); // 10. January 2017. at 10:20
}



