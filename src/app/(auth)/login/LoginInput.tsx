"use client";

import { useState } from "react";

export default function LoginInput() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleEmail = (value: string) => setEmail(value);

  const handlePassword = (value: string) => setPassword(value);

  return (
    <section id="login-input">
      <div>
        <input
          placeholder="Enter your email"
          type="email"
          onChange={(e) => handleEmail(e.target.value)}
        />
      </div>

      <div>
        <input
          placeholder="Enter your password"
          type="password"
          onChange={(e) => handlePassword(e.target.value)}
        />
      </div>
    </section>
  );
}
