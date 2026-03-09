import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/axios";
import type { Profile, Post, User, TabType, ModalType } from "@/components/userProfile/types/userProfile";

export function useUserProfile(username: string) {
  const [profile, setProfile]             = useState<Profile | null>(null);
  const [posts, setPosts]                 = useState<Post[]>([]);
  const [liked, setLiked]                 = useState<Post[]>([]);
  const [tab, setTab]                     = useState<TabType>("gallery");
  const [loading, setLoading]             = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [modal, setModal]                 = useState<ModalType>(null);
  const [modalUsers, setModalUsers]       = useState<User[]>([]);
  const [modalLoading, setModalLoading]   = useState(false);

  // ── Load profile + posts + likes ──────────────────────────
  useEffect(() => {
    if (!username) return;
    setLoading(true);
    Promise.all([
      api.get(`/users/${username}`),
api.get(`/users/${username}/posts`),
api.get(`/users/${username}/likes`),
api.get(`/users/${username}/followers`),
api.get(`/users/${username}/following`),
api.post(`/follow/${username}`),
api.delete(`/follow/${username}`),
    ])
      .then(([profileRes, postsRes, likesRes]) => {
        setProfile(profileRes.data);
        setPosts(postsRes.data?.data ?? postsRes.data?.posts ?? postsRes.data ?? []);
setLiked(likesRes.data?.data ?? likesRes.data?.posts ?? likesRes.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [username]);

  // ── Follow / Unfollow (optimistic) ────────────────────────
  const toggleFollow = useCallback(async () => {
    if (!profile || followLoading) return;
    setFollowLoading(true);

    // Optimistic update 
    setProfile((p) =>
      p ? {
        ...p,
        is_following: !p.is_following,
        followers_count: p.is_following
          ? p.followers_count - 1
          : p.followers_count + 1,
      } : p
    );

    try {
      if (profile.is_following) {
        await api.delete(`/api/follow/${username}`);
      } else {
        await api.post(`/api/follow/${username}`);
      }
    } catch (e) {
      // Revert if error
      setProfile((p) =>
        p ? {
          ...p,
          is_following: !p.is_following,
          followers_count: p.is_following
            ? p.followers_count - 1
            : p.followers_count + 1,
        } : p
      );
      console.error(e);
    } finally {
      setFollowLoading(false);
    }
  }, [profile, username, followLoading]);

  // ── Open followers / following modal ──────────────────────
  const openModal = useCallback(async (type: "followers" | "following") => {
    setModal(type);
    setModalUsers([]);
    setModalLoading(true);
    try {
      const res = type === "followers"
        ? await api.get(`/api/users/${username}/followers`)
        : await api.get(`/api/users/${username}/following`);
      setModalUsers(res.data?.users ?? res.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setModalLoading(false);
    }
  }, [username]);

  const closeModal = useCallback(() => setModal(null), []);

  const gridItems = tab === "gallery" ? posts : liked;

  return {
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
  };
}