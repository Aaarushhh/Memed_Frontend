import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Sign in to manage campaigns or track earnings.
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
