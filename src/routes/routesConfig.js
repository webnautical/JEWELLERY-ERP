import StyleForm from "../user/pages/rdteam/Styleform";
import Styles from "../user/pages/rdteam/Styles";
import Assets from "../user/pages/sourcing/Assets";
import RatesDashboard from "../user/pages/dashboard/Ratesdashboard";
import UserForm from "../user/pages/admin/users/Userform";
import Users from "../user/pages/admin/users/Users";
import Profile from "../user/pages/common/Profile";
import Resetpassword from "../user/pages/common/Resetpassword";
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
import Rate from "../user/pages/sourcing/Rate";
import DataListing from "../user/pages/admin/data_listing/DataListing";
import DataDetail from "../user/pages/admin/data_listing/DataDetail";
import { adminListingRoutes } from "./adminListingRoutes";

export const appMenu = [

    // ── COMMON ──────────────────────────────────────────────────────────────
    {
        title: "Dashboard",
        icon: "bi-speedometer2",
        roles: ["admin", "rd_team", "sourcing_team", "sales_executive", "costing_team"],
        type: "single",
        children: [
            {
                path: "/dashboard",
                element: Dashboard,
                label: "Main Dashboard",
                icon: "bi-speedometer2",
            },
            {
                path: "/profile",
                element: Profile,
                icon: "bi-person-circle",
                hideInMenu: true,
            },
            {
                path: "/reset-password",
                element: Resetpassword,
                icon: "bi-person-circle",
                hideInMenu: true,
            },
        ],
    },

    // ── ADMIN ────────────────────────────────────────────────────────────────
    {
        title: "User Management",
        icon: "bi-people-fill",
        roles: ["admin"],
        children: [
            {
                path: "/users",
                element: Users,
                label: "Users",
                icon: "bi-people-fill",
            },
            {
                path: "/users/add",
                element: UserForm,
                label: "Add User",
                icon: "bi-person-plus-fill",
                hideInMenu: true,
            },
            {
                path: "/users/edit/:id",
                element: UserForm,
                label: "Edit User",
                icon: "bi-person-gear",
                hideInMenu: true,
            },
        ],
    },
    {
        roles: ["admin"],
        type: "single",
        children: [
            ...adminListingRoutes,
            {
                path: "/dataList/:page/view/:id",
                element: DataDetail,
                hideInMenu: true,
            },
        ],
    },
    {
        title: "General Settings",
        icon: "bi-gear-fill",
        roles: ["admin"],
        children: [
            {
                path: "/profile",
                element: Users,
                label: "Update Profile",
                icon: "bi-gear-fill",
            },
        ],
    },

    // ── RD TEAM ──────────────────────────────────────────────────────────────
    {
        title: "Styles",
        icon: "bi-gem",
        roles: ["rd_team"],
        children: [
            {
                path: "/styles",
                element: Styles,
                label: "Styles",
                icon: "bi-gem",
            },
            {
                path: "/styles/add",
                element: StyleForm,
                label: "Add Style",
                icon: "bi-gem",
                hideInMenu: true,
            },
            {
                path: "/styles/edit/:id",
                element: StyleForm,
                label: "Edit Style",
                icon: "bi-gem",
                hideInMenu: true,
            },
        ],
    },

    // ── SOURCING TEAM ────────────────────────────────────────────────────────
    {
        title: "Rates",
        icon: "bi-graph-up-arrow",
        roles: ["sourcing_team"],
        children: [
            {
                path: "/rates-dashboard",
                element: RatesDashboard,
                label: "Dashboard",
                icon: "bi-graph-up-arrow",
            },
            {
                path: "/assets",
                element: Assets,
                label: "Assets",
                icon: "bi-box-seam-fill",
            },
            {
                path: "/rate",
                element: Rate,
                label: "Add Rate",
                icon: "bi-currency-exchange",
            },
        ],
    },

    // ── SALES EXECUTIVE ──────────────────────────────────────────────────────
    {
        title: "Sales",
        icon: "bi-briefcase-fill",
        roles: ["sales_executive"],
        type: "single",
        children: [
            {
                path: "/clients",
                element: Clients,
                label: "Clients",
                icon: "bi-building",
            },
            {
                path: "/client-form",
                element: ClientForm,
                label: "Client Form",
                icon: "bi-building-add",
                hideInMenu: true,
            },
            {
                path: "/inquiries",
                element: Inquiries,
                label: "Inquiries",
                icon: "bi-chat-left-text-fill",
            },
            {
                path: "/inquiry-form",
                element: InquiryForm,
                label: "Inquiry Form",
                icon: "bi-chat-left-text",
                hideInMenu: true,
            },
            {
                path: "/inquiry-detail/:id",
                element: InquiryDetail,
                label: "Inquiry Detail",
                icon: "bi-chat-left-text",
                hideInMenu: true,
            },
            {
                path: "/bom",
                element: BOMs,
                label: "BOM",
                icon: "bi-list-check",
            },
            {
                path: "/bom-form",
                element: BOMForm,
                label: "BOM Form",
                icon: "bi-list-check",
                hideInMenu: true,
            },
            {
                path: "/estimates",
                element: Estimates,
                label: "Estimates",
                icon: "bi-calculator-fill",
            },
            {
                path: "/estimate-detail/:id",
                element: EstimateDetail,
                label: "Estimate Detail",
                icon: "bi-calculator",
                hideInMenu: true,
            },
            {
                path: "/quotes",
                element: Quotes,
                label: "Quotes",
                icon: "bi-file-earmark-text-fill",
            },
            {
                path: "/quote-pdf/:id",
                element: QuotePDF,
                label: "Quote PDF",
                icon: "bi-file-earmark-pdf-fill",
                hideInMenu: true,
            },
        ],
    },

    // ── COSTING TEAM ─────────────────────────────────────────────────────────
    {
        title: "Costing",
        icon: "bi-calculator-fill",
        roles: ["costing_team"],
        type: "single",
        children: [
            {
                path: "/estimate-requests",
                element: EstimateRequests,
                label: "Pending Requests",
                icon: "bi-inbox-fill",
            },
            {
                path: "/estimate-form",
                element: EstimateForm,
                label: "Create Estimate",
                icon: "bi-calculator-fill",
                hideInMenu: true,
            },
        ],
    },

];