"use client";

import { leaveHousehold } from "@/lib/actions/household.actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LeaveHouseholdButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLeave = () => {
    startTransition(async () => {
      const res = await leaveHousehold();
      if (res.success) {
        router.refresh(); // or router.push("/household/create")
      } else {
        alert(res.message);
      }
    });
  };

  return (
    <Button
      variant="destructive"
      className="w-full text-left text-sm"
      onClick={handleLeave}
      disabled={isPending}
    >
      {isPending ? "Leaving..." : "Leave Household"}
    </Button>
  );
}
