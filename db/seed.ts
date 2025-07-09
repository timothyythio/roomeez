import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.billSplit.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.householdMember.deleteMany();
  await prisma.household.deleteMany();
  await prisma.user.deleteMany();

  const userMap = new Map<string, string>(); // email -> userId
  for (const user of sampleData.users) {
    const created = await prisma.user.create({ data: user });
    userMap.set(user.email, created.id);
  }

  const household = await prisma.household.create({
    data: {
      name: sampleData.household.name,
    },
  });

  for (const member of sampleData.householdMembers) {
    const userId = userMap.get(member.userEmail)!;
    await prisma.householdMember.create({
      data: {
        userId,
        householdId: household.id,
        role: member.role,
      },
    });
  }

  for (const bill of sampleData.bills) {
    const paidById = userMap.get(bill.paidByEmail)!;
    const createdBill = await prisma.bill.create({
      data: {
        title: bill.title,
        amount: bill.amount,
        paidById,
        householdId: household.id,
      },
    });

    for (const [email, amountOwed] of Object.entries(bill.splits)) {
      const userId = userMap.get(email)!;
      await prisma.billSplit.create({
        data: {
          billId: createdBill.id,
          userId,
          amountOwed,
          hasPaid: false,
        },
      });
    }
  }

  console.log("🌱 Seed complete");
}

main().finally(() => prisma.$disconnect());
