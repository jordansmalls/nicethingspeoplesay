// app/(auth)/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { signup, checkEmailAvailability } from "@/lib/api";
import { useAppStore } from "@/stores/useAppStore";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [checkedEmail, setCheckedEmail] = useState(false);
  const router = useRouter();
  const { setUser } = useAppStore();

  const handleCheckEmail = async () => {
    if (!email.includes("@")) return;
    try {
      const { taken } = await checkEmailAvailability(email);
      setEmailTaken(taken);
      setCheckedEmail(true);
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailTaken) {
      toast.error("Email is already taken");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const user = await signup({ email, password });
      setUser(user);
      toast("Signup successful");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-6 w-80">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setCheckedEmail(false);
              setEmailTaken(false);
            }}
            onBlur={handleCheckEmail}
            required
          />
          {checkedEmail && emailTaken && <p className="text-red-500 text-sm">Email is taken</p>}
          {checkedEmail && !emailTaken && <p className="text-green-500 text-sm">Email is available</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading || emailTaken} className="w-full">
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
        <p className="text-center">
          Have an account? <Link href="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
}