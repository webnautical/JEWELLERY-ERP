import StyleForm from "../user/pages/admin/rdteam/Styleform";
import Styles from "../user/pages/admin/rdteam/Styles";
import Assets from "../user/pages/admin/sourcing/Assets";
import RatesDashboard from "../user/pages/admin/sourcing/Ratesdashboard";
import UserForm from "../user/pages/admin/users/Userform";
import Users from "../user/pages/admin/users/Users";
import EstimateForm from "../user/pages/costing_team/EstimateForm";
import EstimateRequests from "../user/pages/costing_team/EstimateRequests";
import Dashboard from "../user/pages/Dashboard";
import BOMForm from "../user/pages/sales_executive/bom/Bomform";
import BOMs from "../user/pages/sales_executive/bom/Boms";
import ClientForm from "../user/pages/sales_executive/clients/Clientform";
import Clients from "../user/pages/sales_executive/clients/Clients";
import EstimateDetail from "../user/pages/sales_executive/estimates/Estimatedetail";
import Estimates from "../user/pages/sales_executive/estimates/Estimates";
import Inquiries from "../user/pages/sales_executive/inquiries/Inquiries";
import InquiryDetail from "../user/pages/sales_executive/inquiries/Inquirydetail";
import InquiryForm from "../user/pages/sales_executive/inquiries/InquiryForm";
import QuotePDF from "../user/pages/sales_executive/quotes/Quotepdf";
import Quotes from "../user/pages/sales_executive/quotes/Quotes";



export const appMenu = [
    // COMMON
    {
        title: "Dashboard",
        icon: "dashboard",
        roles: ["admin", 'rd_team', 'sourcing_team', 'sales_executive', 'costing_team'],
        type: "single",
        children: [
            {
                path: "/dashboard",
                element: Dashboard,
                label: "Main Dashboard",
                icon: "bi-speedometer2",
            },
        ],
    },
    // ADMIN ROUTES AND MENU
    {
        title: "User Management",
        icon: "users",
        roles: ["admin"],
        children: [
            {
                path: "/users",
                element: Users,
                label: "Users",
                icon: "bi-people",
            },
            {
                path: "/users/add",
                element: UserForm,
                label: "Users",
                icon: "bi-people",
                hideInMenu: true,
            },
            {
                path: "/users/edit/:id",
                element: UserForm,
                label: "Users",
                icon: "bi-people",
                hideInMenu: true,
            },
        ],
    },
    {
        title: "General Settings",
        icon: "users",
        roles: ["admin"],
        children: [
            {
                path: "/general-setting",
                element: Users,
                label: "Update Profile",
                icon: "bi-people",
            },
        ],
    },

    // RD TEAM ROUTES AND MENU
    {
        title: "Styles",
        icon: "styles",
        roles: ["rd_team"],
        children: [
            {
                path: "/styles",
                element: Styles,
                label: "Styles",
                icon: "bi-palette",
            },
            {
                path: "/styles/add",
                element: StyleForm,
                label: "Add Styles",
                icon: "bi-palette",
                hideInMenu: true,
            },
            {
                path: "/styles/edit/:id",
                element: StyleForm,
                label: "Add Styles",
                icon: "bi-palette",
                hideInMenu: true,
            },
        ],
    },

    // SOURCING TEAM ROUTES AND MENU
    {
        title: "Rates",
        icon: "styles",
        roles: ["sourcing_team"],
        children: [
            {
                path: "/rates-dashboard",
                element: RatesDashboard,
                label: "Dashboard",
                icon: "bi-palette",
            },
            {
                path: "/assets",
                element: Assets,
                label: "Assets",
                icon: "bi-palette",
            },
        ],
    },

    // sales_executive ROUTES AND MENU
    {
        title: "Client",
        icon: "styles",
        roles: ["sales_executive"],
        type: "single",
        children: [
            {
                path: "/clients",
                element: Clients,
                label: "Clients",
                icon: "bi-palette",
            },
            {
                path: "/client-form",
                element: ClientForm,
                label: "Dashboard",
                icon: "bi-palette",
                hideInMenu: true,
            },
            {
                path: "/inquiries",
                element: Inquiries,
                label: "Inquiries",
                icon: "bi-palette",
            },
            {
                path: "/inquiry-form",
                element: InquiryForm,
                label: "Dashboard",
                icon: "bi-palette",
                hideInMenu: true,
            },
            {
                path: "/inquiry-detail/:id",
                element: InquiryDetail,
                label: "Dashboard",
                icon: "bi-palette",
                hideInMenu: true,
            },
            {
                path: "/bom",
                element: BOMs,
                label: "BOM",
                icon: "bi-palette",
            },
            {
                path: "/bom-form",
                element: BOMForm,
                label: "BOM",
                icon: "bi-palette",
                hideInMenu: true,
            },
            {
                path: "/estimates",
                element: Estimates,
                label: "Estimates",
                icon: "bi-palette",
            },
            {
                path: "/estimate-detail/:id",
                element: EstimateDetail,
                label: "Estimate Detail",
                icon: "bi-palette",
                hideInMenu: true,
            },
            {
                path: "/quotes",
                element: Quotes,
                label: "Quotes",
                icon: "bi-palette",
            },

            {
                path: "/quote-pdf/:id",
                element: QuotePDF,
                label: "Quote PDF",
                icon: "bi-palette",
                hideInMenu: true,
            },

        ],
    },


    // costing_team ROUTES AND MENU
    {
        title: "costing_team",
        icon: "styles",
        roles: ["costing_team"],
        type: "single",
        children: [
            {
                path: "/estimate-requests",
                element: EstimateRequests,
                label: "Pending Estimate Requests",
                icon: "bi-palette",
            },
            {
                path: "/estimate-form",
                element: EstimateForm,
                label: "Dashboard",
                icon: "bi-palette",
                hideInMenu: true,
            },
        ],
    },

];