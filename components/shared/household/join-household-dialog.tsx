"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  getHouseholdByCode,
  joinHouseholdByCode,
} from "@/lib/actions/household.actions";
import { useEffect } from "react";

export type JoinState = {
  success: boolean;
  message: string;
};

const initialState: JoinState = {
  success: false,
  message: "",
};

export default function JoinHouseholdDialog() {
  const [code, setCode] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [household, setHousehold] = useState<any | null>(null);
  const [isChecking, startTransition] = useTransition();
  const [state, formAction] = useActionState(joinHouseholdByCode, initialState);
  const router = useRouter();

  const handleCheckCode = () => {
    startTransition(async () => {
      const res = await getHouseholdByCode(code);
      setHousehold(res || null);
    });
  };

  // Handle redirect after joining
  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Join Household
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Join a Household</DialogTitle>
          <DialogDescription>
            Enter a 6-letter code to join a household.
          </DialogDescription>
        </DialogHeader>

        {!household ? (
          <div className="space-y-4">
            <Input
              placeholder="Enter invite code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
            />
            <Button
              onClick={handleCheckCode}
              disabled={isChecking}
              className="w-full"
            >
              {isChecking ? "Checking..." : "Check Code"}
            </Button>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div className="border p-4 rounded-md bg-muted">
              <p className="text-sm">Join household:</p>
              <p className="font-semibold">{household.name}</p>
              <input type="hidden" name="code" value={code} />
            </div>

            {state.message && !state.success && (
              <p className="text-sm text-red-500">{state.message}</p>
            )}

            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="submit"
                variant="default"
                className="w-full sm:w-auto"
              >
                Join Household
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setHousehold(null)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
