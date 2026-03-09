"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/assets/logo/Logo.svg";
import Gradient from "@/public/assets/gradient/Gradient.svg";
import { api } from "@/lib/axios";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/auth/register", {
        name: form.name,
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Register failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Image
        src={Gradient}
        alt="gradient"
        className="absolute bottom-0 pointer-events-none w-full"
      />

      <div className="relative z-10 grid min-h-screen place-items-center px-6 py-8">
        <Card className="grid w-full gap-5 md:gap-6 rounded-3xl border border-neutral-900/20 box-border bg-neutral-950 px-4 py-8 text-white md:w-111.5 md:px-6 md:py-10">
          <div className="grid gap-5 md:gap-6">
            <div className="flex items-center gap-3 justify-center">
              <Image src={Logo} alt="Sociality icon" width={30} height={30} priority />
              <span className="text-3xl leading-none font-bold">Sociality</span>
            </div>
            <h1 className="text-2xl md:display-xs font-bold text-center">Register</h1>
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center font-semibold">{error}</p>
          )}

          <form className="grid gap-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="grid gap-0.5">
              <Label className="text-sm font-bold" htmlFor="name">Name</Label>
              <div className="flex h-12 items-center rounded-xl border border-neutral-900 box-border bg-neutral-950 px-5">
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  className="text-md h-full w-full border-0 bg-transparent p-0 text-base-pure-white shadow-none placeholder:text-neutral-600 placeholder:font-semibold focus-visible:border-transparent focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Username */}
            <div className="grid gap-0.5">
              <Label className="text-sm font-bold" htmlFor="username">Username</Label>
              <div className="flex h-12 items-center rounded-xl border border-neutral-900 box-border bg-neutral-950 px-5">
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  className="text-md h-full w-full border-0 bg-transparent p-0 text-base-pure-white shadow-none placeholder:text-neutral-600 placeholder:font-semibold focus-visible:border-transparent focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Email */}
            <div className="grid gap-0.5">
              <Label className="text-sm font-bold" htmlFor="email">Email</Label>
              <div className="flex h-12 items-center rounded-xl border border-neutral-900 box-border bg-neutral-950 px-5">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="text-md h-full w-full border-0 bg-transparent p-0 text-base-pure-white shadow-none placeholder:text-neutral-600 placeholder:font-semibold focus-visible:border-transparent focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="grid gap-0.5">
              <Label className="text-sm font-bold" htmlFor="phone">Number Phone</Label>
              <div className="flex h-12 items-center rounded-xl border border-neutral-900 box-border bg-neutral-950 px-5">
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Enter your number phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="text-md h-full w-full border-0 bg-transparent p-0 text-base-pure-white shadow-none placeholder:text-neutral-600 placeholder:font-semibold focus-visible:border-transparent focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid gap-0.5">
              <Label className="text-sm font-bold" htmlFor="password">Password</Label>
              <InputGroup className="flex h-12 items-center rounded-xl border border-neutral-900 box-border bg-neutral-950 px-5">
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="text-md h-full w-full p-0 text-white placeholder:text-neutral-600 placeholder:font-semibold focus-visible:border-transparent focus-visible:ring-0"
                />
                <InputGroupAddon align="inline-end" className="pr-0">
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-transparent hover:text-neutral-300"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="h-6 w-6" strokeWidth={2.2} /> : <Eye className="h-6 w-6" strokeWidth={2.2} />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>

            {/* Confirm Password */}
            <div className="grid gap-0.5">
              <Label className="text-sm font-bold" htmlFor="confirmPassword">Confirm Password</Label>
              <InputGroup className="flex h-12 items-center rounded-xl border border-neutral-900 box-border bg-neutral-950 px-5">
                <InputGroupInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="text-md h-full w-full p-0 text-white placeholder:text-neutral-600 placeholder:font-semibold focus-visible:border-transparent focus-visible:ring-0"
                />
                <InputGroupAddon align="inline-end" className="pr-0">
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-transparent hover:text-neutral-300"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-6 w-6" strokeWidth={2.2} /> : <Eye className="h-6 w-6" strokeWidth={2.2} />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              variant="ghost"
              className="text-md flex h-11 md:h-12 items-center justify-center rounded-full bg-primary-300 font-bold text-base-pure-white hover:bg-primary-200 hover:text-base-pure-white transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </form>

          <p className="text-sm md:text-md flex items-center justify-center gap-2 leading-none font-bold text-white">
            <span>Already have an account?</span>
            <Link href="/login" className="text-primary-200 hover:text-gray-400">Log in</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}