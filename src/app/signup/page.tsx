import Link from "next/link";
import AuthGate from "@/components/auth/AuthGate";
import SignupForm from "@/components/auth/SignupForm";
import { ROUTES } from "@/lib/constants";

export default function SignupPage() {
  return (
    <AuthGate mode="guest">
      <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-4 py-12">
        <div className="mb-6">
          <Link href={ROUTES.home} className="text-sm text-zinc-500 hover:text-zinc-800">
            ← Meme&apos;d
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Sign up</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Create a brand or creator account.
          </p>
        </div>
        <SignupForm />
      </main>
    </AuthGate>
  );
}
