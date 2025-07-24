import { getCurrentUser } from "@/lib/actions/user.actions";
import CreateHouseholdForm from "./create-household-form";
import { redirect } from "next/navigation";

export default async function CreateHouseholdPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in"); // from "next/navigation"
  }
  if (!user.id) return null;
  return (
    <div className="max-w-md mx-auto mt-12 space-y-4">
      <h1 className="text-2xl font-semibold">Create a Household</h1>
      <CreateHouseholdForm id={user.id} />
    </div>
  );
}
