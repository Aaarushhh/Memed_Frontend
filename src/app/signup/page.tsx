import Link from "next/link";
import AuthGate from "@/components/auth/AuthGate";
import SignupForm from "@/components/auth/SignupForm";
import { ROUTES } from "@/lib/constants";

export default function SignupPage() {
  return (
    <AuthGate mode="guest">
      <main className="atmos flex min-h-dvh items-center justify-center px-4 py-12">
        <div className="panel-strong rise w-full max-w-md p-6 sm:p-8">
          <Link href={ROUTES.home} className="brand-mark text-xl">
            Meme&apos;d
          </Link>
          <h1 className="font-display mt-5 text-3xl font-bold tracking-tight">Create account</h1>
          <p className="muted mt-2 text-sm">Join as a brand funding campaigns or a creator earning payouts.</p>
          <div className="mt-6">
            <SignupForm />
          </div>
        </div>
      </main>
    </AuthGate>
  );
}
