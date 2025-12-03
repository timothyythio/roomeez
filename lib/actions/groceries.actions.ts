"use server";

import { prisma } from "@/db/prisma";
import { GroceryCategory } from "@prisma/client";
import { getCurrentUser, getCurrentHousehold } from "./user.actions";
import { revalidatePath } from "next/cache";

export async function getGroceryItems() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const household = await getCurrentHousehold();
  if (!household) return [];

  const items = await prisma.groceryItem.findMany({
    where: { householdId: household.id },
    include: { addedBy: true },
    orderBy: { createdAt: "asc" },
  });

  return items;
}

export async function addGroceryItem(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const household = await getCurrentHousehold();
  if (!household) throw new Error("No household");

  const name = (formData.get("name") as string)?.trim();
  const quantity = (formData.get("quantity") as string)?.trim() || null;
  const category =
    (formData.get("category") as string as GroceryCategory) ??
    GroceryCategory.MISC;
  if (!name) return;

  await prisma.groceryItem.create({
    data: {
      name,
      quantity,
      category,

      householdId: household.id,
      addedById: user.id,
    },
  });
  revalidatePath("/groceries");
}

export async function toggleGroceryPurchased(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const item = await prisma.groceryItem.findUnique({ where: { id } });
  if (!item) return;

  await prisma.groceryItem.update({
    where: { id },
    data: { purchased: !item.purchased },
  });

  revalidatePath("/groceries");
}

export async function deleteGroceryItem(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  await prisma.groceryItem.delete({
    where: { id },
  });

  revalidatePath("/groceries");
}
