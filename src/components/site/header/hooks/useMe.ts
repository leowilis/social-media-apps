import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useSelector } from "react-redux";

type Me = {
  id: number;
  name: string;
  username: string;
  avatarUrl: string | null;
};

export function useMe() {
  const [me, setMe] = useState<Me | null>(null);
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;
    api.get("/me").then((res) => setMe(res.data.data.profile));
  }, [isLoggedIn]);

  return { me };
}