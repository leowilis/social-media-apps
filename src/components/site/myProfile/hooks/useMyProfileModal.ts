import { useState, useCallback } from "react";
import { api } from "@/lib/axios";

type ModalType = "followers" | "following" | null;

interface ModalUser {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

export function useMyProfileModal(username?: string) {
  const [modal, setModal] = useState<ModalType>(null);
  const [modalUsers, setModalUsers] = useState<ModalUser[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  const openModal = useCallback(async (type: "followers" | "following") => {
    if (!username) return;
    setModal(type);
    setModalUsers([]);
    setModalLoading(true);
    try {
      const res = type === "followers"
        ? await api.get(`/users/${username}/followers`)
        : await api.get(`/users/${username}/following`);

      const raw = res.data?.data;
      let users: any[] = [];

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

  return { modal, modalUsers, modalLoading, openModal, closeModal };
}