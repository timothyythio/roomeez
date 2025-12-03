// lib/actions/chores.actions.ts
"use server";

import { prisma } from "@/db/prisma";
import { getCurrentUser, getCurrentHousehold } from "./user.actions";
import { revalidatePath } from "next/cache";

export async function getChores() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const household = await getCurrentHousehold();
  if (!household) return [];

  const chores = await prisma.chore.findMany({
    where: { householdId: household.id },
    orderBy: [{ completed: "asc" }, { createdAt: "asc" }],
    include: {
      assignedUser: {
        select: { id: true, name: true },
      },
    },
  });

  return chores;
}

export async function addChore(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const household = await getCurrentHousehold();
  if (!household) throw new Error("No household");

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const schedule = (formData.get("schedule") as string) || "once";

  // "me" | "anyone" (for now)
  const assignee = formData.get("assignee") as string | null;
  const assignedTo = assignee === "me" ? user.id : null; // null = unassigned / anyone can do it

  if (!title) return;

  await prisma.chore.create({
    data: {
      title,
      description,
      schedule, // e.g. "once" | "weekly" | "daily"
      householdId: household.id,
      assignedTo,
    },
  });

  revalidatePath("/chores");
}

export async function toggleChoreCompleted(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const chore = await prisma.chore.findUnique({ where: { id } });
  if (!chore) return;

  await prisma.chore.update({
    where: { id },
    data: { completed: !chore.completed },
  });

  revalidatePath("/chores");
}

export async function deleteChore(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  await prisma.chore.delete({
    where: { id },
  });

  revalidatePath("/chores");
}
