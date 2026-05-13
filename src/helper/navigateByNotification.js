
export const navigateByNotification = (notification, navigate) => {
    const { type, type_id, user_role } = notification;
    switch (type) {
        case "rate":
            if (user_role == "admin") {
                navigate(`/dataList/rate`);
            } else {
                navigate(`/dashboard`);
            }
            break;
        case "client":
            if (user_role == "admin") {
                navigate(`/dataList/clients`);
            } else {
                navigate(`/clients`);
            }
            break;
        case "bom":
            if (user_role == "admin") {
                navigate(`/dataList/boms/view/${type_id}`);
            } else {
                navigate(`/bom-form?id=${type_id}`);
            }
            break;
        case "inquiry":
             if (user_role == "admin") {
                navigate(`/dataList/inquiries/view/${type_id}`);
            } else {
                navigate(`/get-requested-style`);
            }
            break;
        case "quote":
            if (user_role == "admin") {
                navigate(`/dataList/quotes/view/${type_id}`);
            }
            break;
        case "order":
            navigate(`/sales-order`);
            break;
        case "estimate":
            if (user_role == "admin") {
                navigate(`/dataList/estimates/view/${type_id}`);
            } else {
                navigate(`/estimate-requests`);
            }
            break;
        case "asset":
            if (user_role == "admin") {
                navigate(`/dataList/assets`);
            } else {
                navigate(`/assets`);
            }
            break;
        case "new_user":
            navigate(`/profile`);
            break;
        case "new_style":
            if (user_role == "admin") {
                navigate(`/dataList/styles/view/${type_id}`);
            } else {
                navigate(`/styles/edit/${type_id}`);
            }
            break;
        default:
            break;
    }
};