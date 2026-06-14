import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api/usersApi";
import UserCard from "../components/UserCard";
import "../assets/css/User.css";

const Users = () => {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase().trim();
    if (!q) return data;
    return data.filter((u) => {
      const full = `${u.name.first} ${u.name.last}`.toLowerCase();
      const email = u.email?.toLowerCase() ?? "";
      const city = u.location?.city?.toLowerCase() ?? "";
      return full.includes(q) || email.includes(q) || city.includes(q);
    });
  }, [data, search]);

  return (
    <div className="users-page">
      <header className="users-header">
        <div className="users-header-inner">
          <div className="users-title-group">
            <span className="users-eyebrow">Directory</span>
            <h1 className="users-title">Users</h1>
          </div>

          <div className="users-controls">
            <div className="users-search-wrap">
              <svg className="search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                className="users-search"
                type="search"
                placeholder="Search by name, email, or city…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search users"
              />
            </div>

            {!isLoading && data && (
              <span className="users-count">
                {filtered.length} of {data.length}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="users-main">
        {isLoading && (
          <div className="users-grid">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="user-skeleton">
                <div className="skel-avatar" />
                <div className="skel-line long" />
                <div className="skel-line short" />
                <div className="skel-line medium" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="users-error">
            <svg viewBox="0 0 24 24" fill="none" width="32" height="32" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 7v5M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p>Couldn't load users. Check your connection and try again.</p>
          </div>
        )}

        {!isLoading && data && filtered.length === 0 && (
          <div className="users-empty">
            <p>No users match <strong>"{search}"</strong> — try a different name, email, or city.</p>
          </div>
        )}

        {!isLoading && data && filtered.length > 0 && (
          <div className="users-grid">
            {filtered.map((user) => (
              <UserCard key={user.login.uuid} user={user} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Users;