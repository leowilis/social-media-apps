import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/axios";
import type {
  Profile,
  Post,
  User,
  TabType,
  ModalType,
} from "@/components/site/userProfile/types/userProfile";

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

    api
      .get(`/users/${username}/posts`)
      .then((res) => {
        const data = res.data.data?.posts ?? [];
        setPosts(data.map((p: any) => ({
          id: p.id,
          image: p.imageUrl,
          likes_count: p.likeCount,
        })));
      })
      .catch(() => setPosts([]));

    api
      .get(`/users/${username}/likes`)
      .then((res) => {
        const data = res.data.data?.posts ?? [];
        setLiked(data.map((p: any) => ({
          id: p.id,
          image: p.imageUrl,
          likes_count: p.likeCount,
        })));
      })
      .catch(() => setLiked([]));
  }, [username]);

  const toggleFollow = useCallback(async () => {
    if (!profile || followLoading) return;
    setFollowLoading(true);

    setProfile((p) => p ? {
      ...p,
      is_following: !p.is_following,
      followers_count: p.is_following ? p.followers_count - 1 : p.followers_count + 1,
    } : p);

    try {
      if (profile.is_following) {
        await api.delete(`/follow/${username}`);
      } else {
        await api.post(`/follow/${username}`);
      }
    } catch (e) {
      setProfile((p) => p ? {
        ...p,
        is_following: !p.is_following,
        followers_count: p.is_following ? p.followers_count - 1 : p.followers_count + 1,
      } : p);
      console.error(e);
    } finally {
      setFollowLoading(false);
    }
  }, [profile, username, followLoading]);

  const openModal = useCallback(async (type: "followers" | "following") => {
    setModal(type);
    setModalUsers([]);
    setModalLoading(true);
    try {
      const res = type === "followers"
        ? await api.get(`/users/${username}/followers`)
        : await api.get(`/users/${username}/following`);

      // Handle berbagai kemungkinan struktur response API
      const raw = res.data?.data;
      let users: User[] = [];

      if (Array.isArray(raw)) {
        users = raw;
      } else if (Array.isArray(raw?.followers)) {
        users = raw.followers;
      } else if (Array.isArray(raw?.following)) {
        users = raw.following;
      } else if (Array.isArray(raw?.users)) {
        users = raw.users;
      } else if (Array.isArray(res.data)) {
        users = res.data;
      }

      // Normalize field names (avatar vs avatarUrl)
      setModalUsers(users.map((u: any) => ({
        id: u.id,
        name: u.name,
        username: u.username,
        avatar: u.avatar ?? u.avatarUrl ?? "",
      })));
    } catch (e) {
      console.error(e);
      setModalUsers([]);
    } finally {
      setModalLoading(false);
    }
  }, [username]);

  const closeModal = useCallback(() => setModal(null), []);

  const gridItems = tab === "gallery" ? posts : liked;

  return {
    profile, tab, loading, followLoading,
    modal, modalUsers, modalLoading,
    gridItems, setTab, toggleFollow, openModal, closeModal,
  };
}