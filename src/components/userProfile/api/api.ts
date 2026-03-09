const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const getToken = () =>
  typeof window !== "undefined" ? (localStorage.getItem("token") ?? "") : "";

async function apiFetch(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(opts.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

const api = {
  getProfile:   (u: string) => apiFetch(`/api/users/${u}`),
  getPosts:     (u: string) => apiFetch(`/api/users/${u}/posts`),
  getLikes:     (u: string) => apiFetch(`/api/users/${u}/likes`),
  getFollowers: (u: string) => apiFetch(`/api/users/${u}/followers`),
  getFollowing: (u: string) => apiFetch(`/api/users/${u}/following`),
  follow:       (u: string) => apiFetch(`/api/follow/${u}`, { method: "POST" }),
  unfollow:     (u: string) => apiFetch(`/api/follow/${u}`, { method: "DELETE" }),
};