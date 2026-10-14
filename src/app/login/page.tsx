import Link from "next/link";
import AuthGate from "@/components/auth/AuthGate";
import LoginForm from "@/components/auth/LoginForm";
import { ROUTES } from "@/lib/constants";

export default function LoginPage() {
  return (
    <AuthGate mode="guest">
      <main className="atmos flex min-h-dvh items-center justify-center px-4 py-12">
        <div className="panel-strong rise w-full max-w-md p-6 sm:p-8">
          <Link href={ROUTES.home} className="brand-mark text-xl">
            Meme&apos;d
          </Link>
          <h1 className="font-display mt-5 text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="muted mt-2 text-sm">Sign in to your brand or creator account.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </main>
    </AuthGate>
  );
}
