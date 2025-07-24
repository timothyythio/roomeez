"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createHousehold } from "@/lib/actions/household.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateHouseholdForm = ({ id }: { id: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showSuccess, setShowSuccess] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    const result = await createHousehold(formData, id);

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
    <form action={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Household Name</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="e.g. Tim's Apartment"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Create Household"}
      </Button>
    </form>
  );
};

export default CreateHouseholdForm;
