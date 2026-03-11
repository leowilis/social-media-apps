import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/axios";
import type {
  Profile,
  Post,
  User,
  TabType,
  ModalType,
} from "@/components/userProfile/types/userProfile";

export function useUserProfile(username: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [liked, setLiked] = useState<Post[]>([]);
  const [tab, setTab] = useState<TabType>("gallery");
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [modalUsers, setModalUsers] = useState<User[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);

    // Profile
    api
      .get(`/users/${username}`)
      .then((res) => {
        const d = res.data.data;
        setProfile({
          name: d.name,
          username: d.username,
          bio: d.bio,
          avatar: d.avatarUrl,
          followers_count: d.counts.followers,
          following_count: d.counts.following,
          posts_count: d.counts.post,
          likes_count: d.counts.likes,
          is_following: d.isFollowing,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Posts
    api
      .get(`/users/${username}/posts`)
      .then((res) => {
        const data = res.data.data?.posts ?? [];
        setPosts(
          data.map((p: any) => ({
            id: p.id,
            image: p.imageUrl, // ← imageUrl
            likes_count: p.likeCount, // ← likeCount
          })),
        );
      })
      .catch(() => setPosts([]));

      // Likes
    api
      .get(`/users/${username}/likes`)
      .then((res) => {
        const data = res.data.data?.posts ?? [];
        setLiked(
          data.map((p: any) => ({
            id: p.id,
            image: p.imageUrl,
            likes_count: p.likeCount,
          })),
        );
      })
      .catch(() => setLiked([]));
  }, [username]);

  // Follow / Unfollow (optimistic)
  const toggleFollow = useCallback(async () => {
    if (!profile || followLoading) return;
    setFollowLoading(true);

    setProfile((p) =>
      p
        ? {
            ...p,
            is_following: !p.is_following,
            followers_count: p.is_following
              ? p.followers_count - 1
              : p.followers_count + 1,
          }
        : p,
    );

    try {
      if (profile.is_following) {
        await api.delete(`/follow/${username}`);
      } else {
        await api.post(`/follow/${username}`);
      }
    } catch (e) {
      // Revert on error
      setProfile((p) =>
        p
          ? {
              ...p,
              is_following: !p.is_following,
              followers_count: p.is_following
                ? p.followers_count - 1
                : p.followers_count + 1,
            }
          : p,
      );
      console.error(e);
    } finally {
      setFollowLoading(false);
    }
  }, [profile, username, followLoading]);

  // Open followers / following modal
  const openModal = useCallback(
    async (type: "followers" | "following") => {
      setModal(type);
      setModalUsers([]);
      setModalLoading(true);
      try {
        const res =
          type === "followers"
            ? await api.get(`/users/${username}/followers`)
            : await api.get(`/users/${username}/following`);
        const data = res.data.data ?? res.data ?? [];
        setModalUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setModalLoading(false);
      }
    },
    [username],
  );

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
