"use client";

import { useUserProfile } from "./hooks/useUserProfile";
import { User } from "./types/userProfile";

// Helpers
function fmt(n = 0) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

// Spinner
function Spinner({
  size = 28,
  color = "#7c5cfc",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: "3px solid #2a2a35",
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}

// Avatar
function Avatar({
  src,
  name,
  size = 44,
}: {
  src?: string;
  name: string;
  size?: number;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#7c5cfc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        color: "#fff",
        fontSize: size * 0.38,
        flexShrink: 0,
      }}
    >
      {name[0]?.toUpperCase()}
    </div>
  );
}

// Bottom Sheet Modal
function Modal({
  title,
  onClose,
  loading,
  users,
}: {
  title: string;
  onClose: () => void;
  loading: boolean;
  users: User[];
}) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          maxHeight: "70vh",
          background: "#16161e",
          borderRadius: "20px 20px 0 0",
          border: "1px solid #2a2a35",
          borderBottom: "none",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "slideUp 0.25s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "10px 0 0",
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: "#3a3a45",
            }}
          />
        </div>
        <div
          style={{
            padding: "12px 20px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #222230",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 16, color: "#f0f0f8" }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#666",
              fontSize: 24,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {loading ? (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 32 }}
            >
              <Spinner />
            </div>
          ) : users.length === 0 ? (
            <div
              style={{
                padding: 32,
                textAlign: "center",
                color: "#444",
                fontSize: 14,
              }}
            >
              No users found
            </div>
          ) : (
            users.map((u) => (
              <div
                key={String(u.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 20px",
                  borderBottom: "1px solid #1e1e28",
                }}
              >
                <Avatar src={u.avatar} name={u.name} size={44} />
                <div>
                  <div
                    style={{ fontWeight: 600, fontSize: 14, color: "#f0f0f8" }}
                  >
                    {u.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#555" }}>
                    @{u.username}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Main Component
interface UserProfileProps {
  username: string;
  onBack?: () => void;
}

export default function UserProfile({ username, onBack }: UserProfileProps) {
  const {
    profile,
    tab,
    loading,
    followLoading,
    modal,
    modalUsers,
    modalLoading,
    gridItems,
    setTab,
    toggleFollow,
    openModal,
    closeModal,
  } = useUserProfile(username);

  return (
    <div
      style={{
        background: "#0e0e13",
        minHeight: "100vh",
        fontFamily: "'Outfit', sans-serif",
        color: "#f0f0f8",
        maxWidth: 480,
        margin: "0 auto",
        overflowX: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
        @keyframes slideUp { from { transform:translateY(100%); } to { transform:none; } }
        .g-item:hover img   { transform: scale(1.06) !important; }
        .g-item:hover .g-ov { opacity: 1 !important; }
        .follow-btn:active  { transform: scale(0.97); }
        .stat-btn:hover     { background: #1a1a22 !important; }
      `}</style>

      {/* Loading */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spinner />
        </div>
      ) : /* Not found */
      !profile ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            color: "#444",
          }}
        >
          User not found
        </div>
      ) : (
        /* Content */
        <div style={{ animation: "fadeUp 0.35s ease" }}>
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 16px 0",
            }}
          >
            <button
              onClick={onBack ?? (() => window.history.back())}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#f0f0f8",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "inherit",
                padding: 0,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              {profile.name}
            </button>
            <Avatar src={profile.avatar} name={profile.name} size={36} />
          </div>

          {/* Avatar + name */}
          <div
            style={{
              padding: "20px 16px 0",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  border: "2.5px solid #7c5cfc",
                  borderRadius: "50%",
                  padding: 2,
                }}
              >
                <Avatar src={profile.avatar} name={profile.name} size={70} />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 3,
                  right: 3,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#22c55e",
                  border: "2px solid #0e0e13",
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: "-0.3px",
                  lineHeight: 1.2,
                }}
              >
                {profile.name}
              </div>
              <div style={{ color: "#555", fontSize: 13, marginTop: 2 }}>
                @{profile.username}
              </div>
            </div>
          </div>

          {/* Follow + Message */}
          <div style={{ padding: "14px 16px 0", display: "flex", gap: 10 }}>
            <button
              className="follow-btn"
              onClick={toggleFollow}
              disabled={followLoading}
              style={{
                flex: 1,
                padding: "11px 0",
                borderRadius: 12,
                border: profile.is_following ? "1px solid #2a2a38" : "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 15,
                transition: "all 0.2s",
                background: profile.is_following ? "#1a1a24" : "#7c5cfc",
                color: profile.is_following ? "#aaa" : "#fff",
                opacity: followLoading ? 0.75 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {followLoading ? (
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.25)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
              ) : profile.is_following ? (
                <>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Following
                </>
              ) : (
                "Follow"
              )}
            </button>
            <button
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                flexShrink: 0,
                background: "#1a1a22",
                border: "1px solid #2a2a35",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#888"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </button>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p
              style={{
                margin: "14px 16px 0",
                padding: 0,
                fontSize: 13.5,
                color: "#9090a8",
                lineHeight: 1.65,
              }}
            >
              {profile.bio}
            </p>
          )}

          {/* Stats */}
          <div
            style={{
              display: "flex",
              margin: "16px 0 0",
              borderTop: "1px solid #1a1a22",
              borderBottom: "1px solid #1a1a22",
            }}
          >
            {(
              [
                { label: "Post", value: profile.posts_count, click: undefined },
                {
                  label: "Followers",
                  value: profile.followers_count,
                  click: () => openModal("followers"),
                },
                {
                  label: "Following",
                  value: profile.following_count,
                  click: () => openModal("following"),
                },
                {
                  label: "Likes",
                  value: profile.likes_count,
                  click: undefined,
                },
              ] as { label: string; value: number; click?: () => void }[]
            ).map((s, i, arr) => (
              <button
                key={s.label}
                className="stat-btn"
                onClick={s.click}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  cursor: s.click ? "pointer" : "default",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "14px 0",
                  borderRight:
                    i < arr.length - 1 ? "1px solid #1a1a22" : "none",
                  borderRadius: 0,
                  transition: "background 0.15s",
                  fontFamily: "inherit",
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 19,
                    color: "#f0f0f8",
                    letterSpacing: "-0.5px",
                    lineHeight: 1,
                  }}
                >
                  {fmt(s.value)}
                </span>
                <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #1a1a22" }}>
            {[
              {
                key: "gallery" as const,
                label: "Gallery",
                icon: (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                ),
              },
              {
                key: "liked" as const,
                label: "Liked",
                icon: (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill={tab === "liked" ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ),
              },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: 14,
                  color: tab === t.key ? "#f0f0f8" : "#444",
                  padding: "13px 0 11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  borderBottom:
                    tab === t.key
                      ? "2px solid #7c5cfc"
                      : "2px solid transparent",
                  transition: "color 0.2s, border-color 0.2s",
                  marginBottom: -1,
                }}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
            }}
          >
            {!Array.isArray(gridItems) || gridItems.length === 0 ? (
              <div
                style={{
                  gridColumn: "1/-1",
                  padding: "56px 0",
                  textAlign: "center",
                  color: "#333",
                  fontSize: 14,
                }}
              >
                No posts yet
              </div>
            ) : (
  (Array.isArray(gridItems) ? gridItems : []).map((item) => (
                <div
                  key={String(item.id)}
                  className="g-item"
                  style={{
                    position: "relative",
                    aspectRatio: "1/1",
                    overflow: "hidden",
                    background: "#1a1a22",
                    cursor: "pointer",
                  }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  )}
                  <div
                    className="g-ov"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.42)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.2s",
                    }}
                  >
                    <span
                      style={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {item.likes_count}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Spacer for bottom navbar */}
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Modal */}
      {modal && (
        <Modal
          title={modal === "followers" ? "Followers" : "Following"}
          onClose={closeModal}
          loading={modalLoading}
          users={modalUsers}
        />
      )}
    </div>
  );
}
