"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import { setToken, setIsLoggedIn } from "@/store/authSlice";

import Logo from "@/public/assets/logo/Logo.svg";
import Gradient from "@/public/assets/gradient/Gradient.svg";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.data.token;

      localStorage.setItem("token", token);
      dispatch(setToken(token));
      dispatch(setIsLoggedIn(true));

      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Login failed. Please try again.");
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
        <Card className="grid w-full gap-4 md:gap-6 rounded-3xl border border-neutral-900 box-border bg-black/20 px-4 py-8 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur-[2px] md:w-111.5 md:px-6 md:py-10">
          <div className="grid gap-4 md:gap-6">
            <div className="flex items-center gap-3 justify-center">
              <Image src={Logo} alt="Sociality icon" width={30} height={30} priority />
              <span className="text-2xl leading-none font-bold">Sociality</span>
            </div>
            <h1 className="text-xl md:display-xs font-bold text-center">Welcome Back!</h1>
          </div>

          <form className="grid gap-5" onSubmit={handleSubmit}>
            {/* Error */}
            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            {/* Email */}
            <div className="grid gap-0.5">
              <Label className="text-sm font-bold" htmlFor="email">Email</Label>
              <div className="flex h-12 items-center rounded-xl border border-neutral-900 box-border bg-neutral-950 px-5">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-md h-full w-full p-0 text-white placeholder:text-neutral-600 placeholder:font-semibold focus-visible:border-transparent focus-visible:ring-0"
                />
                <InputGroupAddon align="inline-end" className="pr-0">
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-transparent hover:text-neutral-300"
                    aria-label={showPassword ? "Hide password value" : "Show password value"}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-6 w-6" strokeWidth={2.2} />
                    ) : (
                      <Eye className="h-6 w-6" strokeWidth={2.2} />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>

            {/* Button */}
            <Button
              type="submit"
              disabled={isLoading}
              variant="ghost"
              className="text-md flex h-11 md:h-12 items-center justify-center rounded-full bg-primary-300 font-bold text-base-pure-white hover:bg-primary-200 hover:text-base-pure-white transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </form>

          <p className="text-sm md:text-md flex items-center justify-center gap-2 leading-none font-bold text-white">
            <span>Don&apos;t have an account?</span>
            <Link href="/register" className="text-primary-200 hover:text-gray-400">
              Register
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}