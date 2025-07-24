"use server";

import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { CreateBillSchema } from "../validators";
import { formatError } from "../utils";
import { getCurrentHousehold, getCurrentUser } from "./user.actions";
import { startOfMonth, endOfMonth } from "date-fns";

export async function createBill(formData: FormData) {
  const session = await auth();
  const user = session?.user;
  if (!user) throw new Error("Unauthorized");

  // Normalize checkboxes + arrays
  const splitWith = formData.getAll("splitWith") as string[];
  const customSplits = formData.getAll("customSplits") as string[];

  const rawData = Object.fromEntries(formData.entries());

  // Validation with Zod
  const parsed = CreateBillSchema.safeParse({
    ...rawData,
    splitWith,
    customSplits,
  });

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    return {
      success: false,
      message: formatError(parsed.error),
    };
  }

  const data = parsed.data;

  // Prepare BillSplits
  let splits: {
    userId: string;
    amountOwed: number;
    hasPaid: boolean;
    paymentConfirmed: boolean;
  }[] = [];

  if (data.splitEvenly === "true") {
    const perPerson = data.amount / splitWith.length;

    splits = splitWith.map((userId) => ({
      userId,
      amountOwed: parseFloat(perPerson.toFixed(2)),
      hasPaid: userId === data.paidById,
      paymentConfirmed: userId === data.paidById,
    }));
  } else {
    const parsedSplits = customSplits.map((entry) => {
      const { userId, amount } = JSON.parse(entry);
      return {
        userId,
        amountOwed: parseFloat(amount),
        hasPaid: userId === data.paidById,
        paymentConfirmed: userId === data.paidById,
      };
    });

    const total = parsedSplits.reduce((sum, s) => sum + s.amountOwed, 0);
    if (Math.abs(total - data.amount) > 0.01) {
      throw new Error("Custom splits must add up to the total amount");
    }

    splits = parsedSplits;
  }

  const householdMember = await prisma.householdMember.findFirst({
    where: { userId: user.id },
  });

  if (!householdMember)
    return {
      success: false,
      message: "No household found for user",
    };

  await prisma.bill.create({
    data: {
      title: data.title,
      description: data.description,
      amount: data.amount,
      paidById: data.paidById,
      categoryId: data.categoryId,
      householdId: householdMember.householdId,
      isSettled: false,
      billSplits: {
        create: splits,
      },
    },
  });

  revalidatePath("/dashboard"); // Or wherever your bill list is shown

  return {
    success: true,
    message: "Bill Created Successfully!",
  };
}

export async function getBillById(billId: string) {
  return await prisma.bill.findUnique({
    where: { id: billId },
    include: {
      category: true,
      paidBy: {
        select: {
          id: true,
          name: true,
        },
      },
      billSplits: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

export async function getMonthlyTotalBills() {
  const household = await getCurrentHousehold();
  if (!household) return 0;

  const now = new Date();

  const total = await prisma.bill.aggregate({
    where: {
      householdId: household.id,
      createdAt: {
        gte: startOfMonth(now),
        lte: endOfMonth(now),
      },
    },
    _sum: {
      amount: true,
    },
  });

  return total._sum.amount ?? 0;
}

export async function getTotalAmountOwing() {
  const user = await getCurrentUser();
  if (!user) return 0;

  const owed = await prisma.billSplit.aggregate({
    where: {
      userId: user.id,
      hasPaid: false,
    },
    _sum: {
      amountOwed: true,
    },
  });

  return owed._sum.amountOwed ?? 0;
}

export async function getTotalAmountOwed() {
  const user = await getCurrentUser();
  if (!user) return 0;

  const receivable = await prisma.billSplit.aggregate({
    where: {
      hasPaid: false,
      userId: {
        not: user.id,
      },
      bill: {
        paidById: user.id,
      },
    },
    _sum: {
      amountOwed: true,
    },
  });

  return receivable._sum.amountOwed ?? 0;
}

export async function getMonthlyBills() {
  const household = await getCurrentHousehold();
  if (!household) return [];
  const user = await getCurrentUser();
  if (!user) return [];

  const now = new Date();

  const bills = await prisma.bill.findMany({
    where: {
      householdId: household.id,
      createdAt: {
        gte: startOfMonth(now),
        lte: endOfMonth(now),
      },
    },
    include: {
      category: true,
      paidBy: {
        select: {
          name: true,
          id: true,
        },
      },
      billSplits: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bills;
}

export async function getBillsUserOwes() {
  const user = await getCurrentUser();
  if (!user) return [];

  const unpaidSplits = await prisma.billSplit.findMany({
    where: {
      userId: user.id,
      hasPaid: false,
    },
    include: {
      bill: {
        include: {
          category: true,
          paidBy: {
            select: {
              name: true, // Assumes 'name' is on user model
            },
          },
        },
      },
    },
  });

  return unpaidSplits.map((split) => ({
    id: split.bill.id,
    title: split.bill.title,
    amount: split.bill.amount,
    amountOwed: split.amountOwed,
    createdAt: split.bill.createdAt,
    category: split.bill.category?.name ?? "Uncategorized",
    paidByName: split.bill.paidBy?.name ?? "Unknown",
    hasPaid: split.hasPaid,
    hasConfirmed: split.paymentConfirmed,
    isSettled: split.bill.isSettled,
  }));
}

export async function getBillsUserIsOwed() {
  const user = await getCurrentUser();
  if (!user) return [];

  const splits = await prisma.billSplit.findMany({
    where: {
      hasPaid: false,
      userId: { not: user.id }, // others
      bill: {
        paidById: user.id, // user is payer
      },
    },
    include: {
      bill: {
        include: {
          category: true,
          paidBy: {
            select: { name: true },
          },
        },
      },
      user: {
        select: { name: true },
      },
    },
  });

  return splits.map((split) => ({
    id: split.bill.id,
    title: split.bill.title,
    amount: split.bill.amount,
    amountOwed: split.amountOwed,
    createdAt: split.bill.createdAt,
    owedByName: split.user.name ?? "Unknown",
    category: split.bill.category?.name ?? "Uncategorized",
    paidByName: split.bill.paidBy?.name ?? "Unknown",
    hasPaid: split.hasPaid,
    hasConfirmed: split.paymentConfirmed,
    isSettled: split.bill.isSettled,
  }));
}

export async function getBillParticipants(billId: string) {
  return await prisma.billSplit.findMany({
    where: {
      billId,
    },
    include: {
      user: true,
    },
  });
}

type BillUserStatus = {
  role: "payer" | "payee";
  paid: boolean;
  confirmed: boolean;
};

export async function getUserStatusInBill(
  billId: string,
  userId: string
): Promise<BillUserStatus | null> {
  const bill = await prisma.bill.findUnique({
    where: { id: billId },
    include: {
      paidBy: true,
      billSplits: {
        where: { userId },
        select: {
          hasPaid: true,
          paymentConfirmed: true,
        },
      },
    },
  });

  if (!bill) return null;

  const isPayer = bill.paidBy.id === userId;
  const userSplit = bill.billSplits[0];

  return {
    role: isPayer ? "payer" : "payee",
    paid: isPayer ? true : userSplit?.hasPaid ?? false,
    confirmed: isPayer ? true : userSplit?.paymentConfirmed ?? false,
  };
}

export async function updateBillStatus({
  billId,
  userId,
  hasPaid,
  paymentConfirmed,
}: {
  billId: string;
  userId: string;
  hasPaid?: boolean;
  paymentConfirmed?: boolean;
}) {
  await prisma.billSplit.updateMany({
    where: { billId, userId },
    data: {
      ...(hasPaid !== undefined && { hasPaid }),
      ...(paymentConfirmed !== undefined && { paymentConfirmed }),
    },
  });

  await settleBill(billId);
  return {
    success: true,
    message: "Bill Updated Successfully!",
  };
}

export async function settleBill(billId: string) {
  const splits = await prisma.billSplit.findMany({
    where: { billId },
  });

  const allPaid = splits.every((s) => s.hasPaid);
  const allConfirmed = splits.every((s) => s.paymentConfirmed);

  if (allPaid && allConfirmed) {
    await prisma.bill.update({
      where: { id: billId },
      data: { isSettled: true },
    });
  } else {
    await prisma.bill.update({
      where: { id: billId },
      data: { isSettled: false },
    });
  }
}
