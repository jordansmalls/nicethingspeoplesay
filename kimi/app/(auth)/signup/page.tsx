// app/(auth)/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAppStore } from "@/stores/useAppStore";
import { signup, checkEmailAvailability } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check, X } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const setUser = useAppStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"available" | "taken" | null>(null);

  const checkEmail = async (email: string) => {
    if (!email || !email.includes("@")) {
      setEmailStatus(null);
      return;
    }
    setIsCheckingEmail(true);
    try {
      const result = await checkEmailAvailability(email);
      setEmailStatus(result.taken ? "taken" : "available");
    } catch {
      setEmailStatus(null);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailStatus === "taken") {
      toast.error("Email is already taken");
      return;
    }
    setIsLoading(true);

    try {
      const user = await signup({ email, password });
      setUser(user);
      toast.success("Account created successfully!");
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="text-sm text-neutral-500">
          Start collecting nice things people say
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailStatus(null);
              }}
              onBlur={() => checkEmail(email)}
              required
              className="h-11 pr-10"
            />
            {isCheckingEmail && (
              <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-neutral-400" />
            )}
            {!isCheckingEmail && emailStatus === "available" && (
              <Check className="absolute right-3 top-3 h-5 w-5 text-green-500" />
            )}
            {!isCheckingEmail && emailStatus === "taken" && (
              <X className="absolute right-3 top-3 h-5 w-5 text-red-500" />
            )}
          </div>
          {emailStatus === "taken" && (
            <p className="text-xs text-red-500">This email is already taken</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="h-11"
          />
          <p className="text-xs text-neutral-500">Must be at least 8 characters</p>
        </div>

        <Button
          type="submit"
          className="w-full h-11"
          disabled={isLoading || emailStatus === "taken"}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-neutral-900 hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}