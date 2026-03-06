"use client";

import { useState } from "react";

export default function RegisterInput() {
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleName = (value: string) => setName(value)
  const handleUsername = (value: string) => setUsername(value)
  const handleEmail = (value: string) => setEmail(value)
  const handlePhone = (value: string) => setPhone(value)
  const handlePassword = (value: string) => setPassword(value)
  
  return (
    <section id="register-input">
      <div>
        <input placeholder="Enter your name" onChange={(e) => handleName(e.target.value)}/>
      </div>
      <div>
        <input placeholder="Enter your username" onChange={(e) => handleUsername(e.target.value)} />
      </div>
      <div>
        <input placeholder="Enter your email" type="email" onChange={(e) => handleEmail(e.target.value)}/>
      </div>
      <div>
        <input placeholder="Enter your phone number" type="phone" onChange={(e) => handlePhone(e.target.value)} />
      </div>
      <div>
        <input placeholder="Enter your password" type="password" onChange={(e) => handlePassword(e.target.value)}/>
      </div>
    </section>
  );
}
