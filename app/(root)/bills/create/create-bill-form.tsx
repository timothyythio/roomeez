"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBill } from "@/lib/actions/bills.actions";
import { useRouter } from "next/navigation";

type HouseholdMember = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
};

type Props = {
  members: HouseholdMember[];
  categories: Category[];
  currentUserId: string;
};

export default function CreateBillForm({
  members,
  categories,
  currentUserId,
}: Props) {
  const [splitEvenly, setSplitEvenly] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [splits, setSplits] = useState<Record<string, number>>({});
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    members.map((m) => m.id)
  ); // default: all checked

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showSuccess, setShowSuccess] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    const result = await createBill(formData);

    if (result?.success) {
      setMessage(result.message);
      setShowSuccess(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      // optional: toast or alert for error
      alert(result?.message || "Something went wrong.");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      {showSuccess && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-gray-200 px-6 py-3 rounded shadow-lg z-50 text-center">
          ✅ {message || "Bill Added!"}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6 max-w-xl mx-auto mt-10">
        <div>
          <Label>Title</Label>
          <Input required name="title" placeholder="e.g., Electricity Bill" />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea name="description" placeholder="Optional notes" />
        </div>

        <div>
          <Label>Amount</Label>
          <Input
            required
            type="number"
            name="amount"
            min="0"
            step="0.1"
            placeholder="0"
          />
        </div>

        <div>
          <Label>Category</Label>
          <Select name="categoryId">
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Paid By</Label>
          <Select name="paidById" defaultValue={currentUserId}>
            <SelectTrigger>
              <SelectValue placeholder="Select payer" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Split With</Label>
          {members.map((member) => (
            <label key={member.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="splitWith"
                value={member.id}
                checked={selectedUserIds.includes(member.id)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const id = member.id;
                  setSelectedUserIds((prev) =>
                    checked ? [...prev, id] : prev.filter((uid) => uid !== id)
                  );
                }}
                className="form-checkbox"
              />
              <span>{member.name}</span>
            </label>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Label>Split Evenly</Label>
          <Switch checked={splitEvenly} onCheckedChange={setSplitEvenly} />
        </div>

        {!splitEvenly && (
          <div className="space-y-4">
            {selectedUserIds.map((userId) => {
              const member = members.find((m) => m.id === userId);
              if (!member) return null;
              return (
                <div key={userId} className="flex items-center gap-2">
                  <Label className="w-24">{member.name}</Label>
                  <>
                    <input
                      type="hidden"
                      name="customSplits"
                      value={JSON.stringify({
                        userId,
                        amount: splits[userId] || 0,
                      })}
                    />
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={splits[userId] ?? ""}
                      onChange={(e) =>
                        setSplits((prev) => ({
                          ...prev,
                          [userId]: parseFloat(e.target.value || "0"),
                        }))
                      }
                    />
                  </>
                </div>
              );
            })}
          </div>
        )}

        <input
          type="hidden"
          name="splitEvenly"
          value={splitEvenly.toString()}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Bill"}
        </Button>
      </form>
    </>
  );
}
