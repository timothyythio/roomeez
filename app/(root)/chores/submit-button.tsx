// app/(dashboard)/chores/SubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Adding..." : "Add"}
    </button>
  );
}
