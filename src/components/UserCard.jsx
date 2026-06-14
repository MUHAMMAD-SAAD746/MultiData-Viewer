import "../assets/css/UserCard.css";

/* Deterministic hue from a string — spreads colors evenly across the grid */
const nameToHue = (str = "") => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffff;
  return (h % 360);
};

const Avatar = ({ name, picture }) => {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const hue = nameToHue(name);
  const bg  = `hsl(${hue} 55% 88%)`;
  const fg  = `hsl(${hue} 55% 28%)`;

  if (picture?.medium) {
    return (
      <img
        className="uc-avatar-img"
        src={picture.medium}
        alt={name}
        width={64}
        height={64}
      />
    );
  }

  return (
    <div className="uc-avatar-initials" style={{ background: bg, color: fg }}>
      {initials}
    </div>
  );
};

const UserCard = ({ user }) => {
  const fullName = `${user.name?.first ?? ""} ${user.name?.last ?? ""}`.trim();
  const email    = user.email ?? "";
  const phone    = user.phone ?? "";
  const city     = user.location?.city ?? "";
  const country  = user.location?.country ?? "";
  const gender   = user.gender
    ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
    : "";
  const age      = user.dob?.age ?? null;

  return (
    <article className="user-card">
      {/* Top: avatar + name */}
      <div className="uc-top">
        <Avatar name={fullName} picture={user.picture} />
        <div className="uc-identity">
          <p className="uc-name">{fullName}</p>
          {(gender || age) && (
            <p className="uc-meta">
              {[gender, age ? `${age} yrs` : null].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="uc-divider" />

      {/* Details */}
      <ul className="uc-details">
        {email && (
          <li className="uc-detail-row">
            <svg className="uc-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <a className="uc-link" href={`mailto:${email}`}>{email}</a>
          </li>
        )}
        {phone && (
          <li className="uc-detail-row">
            <svg className="uc-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 2h3l1.5 4L8 7.5c1 2 2.5 3.5 4.5 4.5L14 10.5l4 1.5v3a1 1 0 0 1-1 1C6.5 17.5 2.5 7.5 3 4a1 1 0 0 1 1-1l1-.001z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            <span>{phone}</span>
          </li>
        )}
        {(city || country) && (
          <li className="uc-detail-row">
            <svg className="uc-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 2a6 6 0 0 1 6 6c0 4-6 10-6 10S4 12 4 8a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <span>{[city, country].filter(Boolean).join(", ")}</span>
          </li>
        )}
      </ul>

      {/* Footer: UUID badge + action */}
      <div className="uc-footer">
        <span className="uc-uuid">{user.login?.uuid?.slice(0, 8) ?? "—"}</span>
        <a className="uc-action" href={`mailto:${email}`}>
          Message
          <svg viewBox="0 0 16 16" fill="none" width="12" height="12" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </article>
  );
};

export default UserCard;