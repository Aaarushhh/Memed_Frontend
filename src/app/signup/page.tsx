import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Sign up</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Create a brand or creator account.
        </p>
      </div>
      <SignupForm />
    </main>
  );
}
