// household.actions.ts
"use server";

import { prisma } from "@/db/prisma";
import { getCurrentUser, getUserById } from "./user.actions";
import { CreateHouseholdSchema } from "../validators";
import { generateInviteCode } from "../utils";
import type { JoinState } from "@/components/shared/household/join-household-dialog";

//Ensures invite code is unique and not repeated
async function generateUniqueInviteCode(): Promise<string> {
  let code: string;
  let exists = true;

  do {
    code = generateInviteCode();
    const existing = await prisma.household.findUnique({
      where: { inviteCode: code },
    });
    exists = !!existing;
  } while (exists);

  return code;
}

export async function createHousehold(formData: FormData, userId: string) {
  // Check for user first
  const user = await getUserById(userId);
  if (!user)
    return {
      success: false,
      message: "User doesn't exist, failed to create household",
    };

  const household = CreateHouseholdSchema.parse({
    name: formData.get("name"),
  });
  const inviteCode = await generateUniqueInviteCode();

  const house = await prisma.household.create({
    data: {
      name: household.name,
      inviteCode: inviteCode,
      members: {
        create: {
          user: {
            connect: { id: user.id },
          },
          role: "admin",
        },
      },
    },
    include: {
      members: true,
    },
  });

  if (!house)
    return {
      success: false,
      message: "household was not created successfully!",
    };

  return {
    success: true,
    message: "household created successfully!",
    house,
  };
}

export async function getHouseholdByCode(code: string) {
  const household = await prisma.household.findUnique({
    where: { inviteCode: code },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  return household;
}

export async function getCurrentUserHousehold() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const membership = await prisma.householdMember.findFirst({
    where: { userId: user.id },
    include: {
      household: {
        include: { members: { include: { user: true } } },
      },
    },
  });

  return membership?.household || null;
}

export async function joinHouseholdByCode(
  prevState: JoinState,
  formData: FormData
): Promise<JoinState> {
  const code = formData.get("code") as string;

  if (!code) {
    return { success: false, message: "Code is required" };
  }
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Not authenticated." };
  }

  // Check if user is already in a household
  const existing = await prisma.householdMember.findFirst({
    where: { userId: user.id },
  });

  if (existing) {
    return {
      success: false,
      message: "You're already part of a household.",
    };
  }

  // Find the household by invite code
  const household = await prisma.household.findUnique({
    where: { inviteCode: code },
  });

  if (!household) {
    return {
      success: false,
      message: "Invalid invite code.",
    };
  }

  // Add user to the household
  await prisma.householdMember.create({
    data: {
      user: { connect: { id: user.id } },
      household: { connect: { id: household.id } },
      role: "member",
    },
  });

  return {
    success: true,
    message: `You've joined ${household.name}`,
  };
}

export async function updateHouseholdName(householdId: string, name: string) {
  console.log(householdId, name);
}
export async function deleteHousehold(householdId: string) {
  console.log(householdId);
}

export async function leaveHousehold(): Promise<{
  success: boolean;
  message: string;
}> {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "User not authenticated." };

  const membership = await prisma.householdMember.findFirst({
    where: { userId: user.id },
  });

  if (!membership) {
    return { success: false, message: "You are not in a household." };
  }

  // UNCOMMENT THIS BEFORE DEPLOYING

  // if (membership.role === "admin") {
  //   return {
  //     success: false,
  //     message: "Admins can't leave the household. Transfer ownership first.",
  //   };
  // }

  try {
    await prisma.householdMember.delete({
      where: { id: membership.id },
    });

    // DELETE HOUSEHOLD IF USER WAS LAST USER

    // const remaining = await prisma.householdMember.count({
    //   where: { householdId: membership.householdId },
    // });
    // if (remaining === 0) {
    //   await prisma.household.delete({ where: { id: membership.householdId } });
    // }

    return { success: true, message: "You have left the household." };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Something went wrong." };
  }
}
