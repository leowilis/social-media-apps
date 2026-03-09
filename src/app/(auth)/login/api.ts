import { api } from "@/lib/axios";
import { LoginPayload, LoginResponse } from "./type";

export async function loginUser(payload: LoginPayload) {
  const res = await api.post<LoginResponse>("/auth/login", payload);
  return res.data;
}
