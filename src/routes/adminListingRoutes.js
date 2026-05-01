import DataListing from "../user/pages/admin/data_listing/DataListing";

export const adminListingRoutes = [
    {
        path: "/dataList/:page",
        navPath: "/dataList/styles",
        element: DataListing,
        label: "Styles",
        icon: "bi-gem",
    },
    {
        path: "/dataList/:page",
        navPath: "/dataList/clients",
        element: DataListing,
        label: "Clients",
        icon: "bi-building",
    },
    {
        path: "/dataList/:page",
        navPath: "/dataList/inquiries",
        element: DataListing,
        label: "Inquiries",
        icon: "bi-chat-left-text-fill",
    },
    {
        path: "/dataList/:page",
        navPath: "/dataList/estimates",
        element: DataListing,
        label: "Estimates",
        icon: "bi-calculator-fill",
    },
    {
        path: "/dataList/:page",
        navPath: "/dataList/quotes",
        element: DataListing,
        label: "Quotes",
        icon: "bi-file-earmark-text-fill",
    },
    {
        path: "/dataList/:page",
        navPath: "/dataList/material_assets",
        element: DataListing,
        label: "Material Assets",
        icon: "bi-box-seam-fill",
    },
    {
        path: "/dataList/:page",
        navPath: "/dataList/material_rates",
        element: DataListing,
        label: "Material Rates",
        icon: "bi-currency-exchange",
    },
    {
        path: "/dataList/:page",
        navPath: "/dataList/boms",
        element: DataListing,
        label: "BOMs",
        icon: "bi-list-check",
    },
        {
        path: "/dataList/:page",
        navPath: "/dataList/notifications",
        element: DataListing,
        label: "Notifications",
        icon: "bi-bell-fill",
    },
]