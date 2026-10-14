"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/api";
import { DEFAULT_ROLE, ROLES, ROUTES } from "@/lib/constants";
import type { UserRole } from "@/types";

export default function SignupForm() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(DEFAULT_ROLE);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Signup failed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="label">
          Name
        </label>
        <input
          id="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="field"
        />
      </div>

      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field"
        />
      </div>

      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field"
        />
      </div>

      <fieldset>
        <legend className="label mb-2">I am a</legend>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((value) => {
            const active = role === value;
            return (
              <label
                key={value}
                className={`cursor-pointer rounded-xl border px-3 py-3 text-center text-sm font-semibold capitalize transition-colors ${
                  active
                    ? "border-[var(--ink)] bg-[var(--accent)]"
                    : "border-[var(--line)] bg-white hover:border-[var(--ink)]"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={value}
                  checked={active}
                  onChange={() => setRole(value)}
                  className="sr-only"
                />
                {value}
              </label>
            );
          })}
        </div>
      </fieldset>

      {error ? (
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={submitting} className="btn btn-primary w-full">
        {submitting ? "Creating account…" : "Sign up"}
      </button>

      <p className="muted text-center text-sm">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="font-semibold text-[var(--ink)] underline">
          Login
        </Link>
      </p>
    </form>
  );
}
