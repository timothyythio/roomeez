import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";
import { generateInviteCode } from "@/lib/utils";

const prisma = new PrismaClient();

async function main() {
  await prisma.billSplit.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.householdMember.deleteMany();
  await prisma.household.deleteMany();
  await prisma.user.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();

  // npx tsx ./db/seed COMMAND FOR SEEDING (Change the route if this file is moved)

  //USERS Seed
  const userMap = new Map<string, string>(); // email -> userId
  for (const user of sampleData.users) {
    const created = await prisma.user.create({ data: user });
    userMap.set(user.email, created.id);
  }

  // HOUSEHOLD Seed
  const household = await prisma.household.create({
    data: {
      name: sampleData.household.name,
      inviteCode: generateInviteCode(),
    },
  });

  //HOUSEHOLD MEMEBERS Seed
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

  // BILL CATEGORIES Seed
  const categoryMap = new Map<string, string>(); // name -> id
  for (const category of sampleData.billCategories) {
    const created = await prisma.billCategory.create({
      data: {
        name: category.name,
        createdById: category.createdBy,
      },
    });
    categoryMap.set(category.name, created.id);
  }

  for (const bill of sampleData.bills) {
    const paidById = userMap.get(bill.paidByEmail)!;
    const categoryId = categoryMap.get(bill.categoryName); // 🔥 new line

    const createdBill = await prisma.bill.create({
      data: {
        title: bill.title,
        description: bill.description, // 🔥 new field
        amount: bill.amount,
        paidById,
        householdId: household.id,
        categoryId, // 🔥 new field
        isSettled: false, // 🔥 new field
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
          paymentConfirmed: false,
          note: null,
        },
      });
    }
  }

  console.log("🌱 Seed complete");
}

main().finally(() => prisma.$disconnect());
