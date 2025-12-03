"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNetBalanceBetween } from "@/lib/actions/bills.actions";

interface MemberInfoDialogProps {
  member: {
    id: string;
    name: string;
    image?: string | null;
  };
  currentUserId: string;
}

interface BalanceData {
  youOwe: number;
  theyOwe: number;
  net: number;
}

const MemberInfoDialog: React.FC<MemberInfoDialogProps> = ({
  member,
  currentUserId,
}) => {
  const [balance, setBalance] = useState<BalanceData | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      const result = await getNetBalanceBetween(currentUserId, member.id);
      setBalance(result);
    }

    fetchBalance();
  }, [currentUserId, member.id]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Avatar>
          <AvatarImage src={member.image || ""} />
          <AvatarFallback>
            {member.name.charAt(0).toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Balance with {member.name}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4 mt-2">
          <Avatar className="w-12 h-12">
            <AvatarImage src={member.image || ""} />
            <AvatarFallback>{member.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="text-lg font-medium">{member.name}</div>
        </div>

        {balance ? (
          <div className="mt-4 space-y-2">
            <p>
              You owe them: <strong>${balance.youOwe.toFixed(2)}</strong>
            </p>
            <p>
              They owe you: <strong>${balance.theyOwe.toFixed(2)}</strong>
            </p>
            <p className="mt-2">
              Net Balance:{" "}
              {balance.net > 0 ? (
                <span className="text-green-600">
                  They owe you ${balance.net.toFixed(2)}
                </span>
              ) : balance.net < 0 ? (
                <span className="text-red-600">
                  You owe them ${Math.abs(balance.net).toFixed(2)}
                </span>
              ) : (
                <span className="text-gray-600">You are even</span>
              )}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MemberInfoDialog;
