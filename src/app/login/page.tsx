import Link from "next/link";
import GuestOnly from "@/components/auth/GuestOnly";
import LoginForm from "@/components/auth/LoginForm";
import { ROUTES } from "@/lib/constants";

export default function LoginPage() {
  return (
    <GuestOnly>
      <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-4 py-12">
        <div className="mb-6">
          <Link href={ROUTES.home} className="text-sm text-zinc-500 hover:text-zinc-800">
            ← Meme&apos;d
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Login</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Sign in to manage campaigns or track earnings.
          </p>
        </div>
        <LoginForm />
      </main>
    </GuestOnly>
  );
}
