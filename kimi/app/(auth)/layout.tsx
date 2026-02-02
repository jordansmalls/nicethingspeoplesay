import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check - if has session cookie, redirect to dashboard
  const hasSession = cookies().has("auth") || cookies().has("jwt");

  // Note: In production, you'd verify the token here
  // For now, we let the client-side handle the actual validation

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}