"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { getCurrentUserHousehold } from "@/lib/actions/household.actions";

export default function InviteMemberDialog() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      startTransition(async () => {
        const household = await getCurrentUserHousehold();

        const result = household?.inviteCode;
        setCode(result ?? null);
      });
    }
  }, [open]);

  const handleCopy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-full text-left text-sm mt-2"
      >
        Invite Member
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a Member</DialogTitle>
          </DialogHeader>

          <div className="text-sm text-gray-700 mt-2">
            {isPending ? (
              <p>Loading code...</p>
            ) : code ? (
              <div className="flex items-center justify-between bg-gray-100 rounded px-3 py-2 mt-2">
                <span className=" text-lg tracking-widest">{code}</span>
                <Button size="sm" variant="secondary" onClick={handleCopy}>
                  {copied ? "Copied!" : <CopyIcon size={16} />}
                </Button>
              </div>
            ) : (
              <p className="text-red-500">No code available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
