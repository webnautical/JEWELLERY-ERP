import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllUsersQuery,
  useToggleUserStatusMutation,
} from "../../../../api/UserAPI";
import {
  showSuccess,
  showError,
  showConfirm,
} from "../../../../helper/Utility";

const ROLES = [
  { value: "rd_team", label: "RD Team", badge: "rb-rd" },
  { value: "sourcing_team", label: "Sourcing Team", badge: "rb-sourcing" },
  { value: "costing_team", label: "Costing Team", badge: "rb-costing" },
  { value: "sales_executive", label: "Sales Executive", badge: "rb-sales" },
  {
    value: "production_manager",
    label: "Production Manager",
    badge: "rb-production",
  },
  { value: "qc_supervisor", label: "QC Supervisor", badge: "rb-qc" },
  { value: "vendor", label: "Vendor", badge: "rb-vendor" },
];

const getRoleBadge = (role) => {
  const found = ROLES.find((r) => r.value === role);
  return (
    <span className={`role-badge ${found?.badge || ""}`}>
      {found?.label || role}
    </span>
  );
};

const Users = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, refetch } = useGetAllUsersQuery({
    search,
    role: roleFilter,
    page,
    limit,
  });
  const [toggleStatus] = useToggleUserStatusMutation();

  const users = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalRecs = data?.totalRecords ?? users.length;

  const handleToggle = async (user) => {
    const action = user.status === "active" ? "disable" : "enable";
    const confirm = await showConfirm(
      `Are you sure you want to ${action} ${user.first_name} ${user.last_name}?`,
      `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
    );
    if (!confirm.isConfirmed) return;
    try {
      await toggleStatus(user.id).unwrap();
      showSuccess(`User ${action}d successfully.`);
      refetch();
    } catch (err) {
      showError(err?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="page-wrapper">
      {/* PAGE HEADER */}
      <div className="pg-header">
        <div>
          <div className="pg-title">Users</div>
          <div className="pg-sub">Manage all system users and their roles.</div>
        </div>
        <div className="btn-row">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/users/add")}
          >
            ＋ Add User
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            All Users
            <span
              style={{
                fontSize: 12,
                color: "var(--g500)",
                fontWeight: 400,
                marginLeft: 8,
              }}
            >
              ({totalRecs} total)
            </span>
          </div>
          <div className="table-filters">
            <input
              className="filter-inp"
              placeholder="Search name, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <select
              className="filter-select"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Roles</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: "center",
                    padding: 30,
                    color: "var(--g500)",
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: "center",
                    padding: 30,
                    color: "var(--g500)",
                  }}
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={user.id}>
                  <td style={{ color: "var(--g500)", fontSize: 11 }}>
                    {(page - 1) * limit + idx + 1}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>
                      {user.first_name} {user.last_name}
                    </div>
                  </td>
                  <td style={{ color: "var(--g700)" }}>{user.email}</td>
                  <td style={{ color: "var(--g700)" }}>{user.phone || "—"}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>
                    <span
                      className={`pill ${user.status === "active" ? "p-active" : "p-inactive"}`}
                    >
                      <span className="pdot" />
                      {user.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ fontSize: 11.5, color: "var(--g500)" }}>
                    {user.last_login_at
                      ? new Date(user.last_login_at).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn-sm"
                        onClick={() => navigate(`/users/edit/${user.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-sm-red"
                        onClick={() => handleToggle(user)}
                      >
                        {user.status === "active" ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pagination">
          <div className="page-info">
            Showing {users.length} of {totalRecs} users
          </div>
          <div className="page-btns">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`page-btn ${p === page ? "active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
