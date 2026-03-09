import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

type ProfileForm = {
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string | null;
};

export function useEditProfile() {
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    avatarUrl: null,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/me").then((res) => {
      const p = res.data.data.profile;
      setForm({
        name: p.name ?? "",
        username: p.username ?? "",
        email: p.email ?? "",
        phone: p.phone ?? "",
        bio: p.bio ?? "",
        avatarUrl: p.avatarUrl ?? null,
      });
    }).finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setError("");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("bio", form.bio);
      formData.append("phone", form.phone);
      if (avatarFile) formData.append("avatar", avatarFile);

      await api.patch("/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push("/myProfile");
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    avatarPreview,
    isLoading,
    isSaving,
    success,
    error,
    handleChange,
    handleAvatarChange,
    handleSubmit,
  };
}