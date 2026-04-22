import StyleForm from "../user/pages/admin/rdteam/Styleform";
import Styles from "../user/pages/admin/rdteam/Styles";
import Assets from "../user/pages/admin/sourcing/Assets";
import RatesDashboard from "../user/pages/admin/sourcing/Ratesdashboard";
import UserForm from "../user/pages/admin/users/Userform";
import Users from "../user/pages/admin/users/Users";
import Dashboard from "../user/pages/Dashboard";


export const appMenu = [
    // ADMIN ROUTES AND MENU
    {
        title: "Dashboard",
        icon: "dashboard",
        roles: ["admin", 'rd_team', 'sourcing_team'],
        children: [
            {
                path: "/dashboard",
                element: Dashboard,
                label: "Main Dashboard",
                icon: "bi-speedometer2",
            },
        ],
    },
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
];