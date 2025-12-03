"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 rounded-md bg-black text-white text-sm disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Adding..." : "Add"}
    </button>
  );
}
