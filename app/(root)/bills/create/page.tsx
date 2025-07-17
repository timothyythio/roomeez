import { auth } from "@/auth";
import CreateBillForm from "./create-bill-form";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";

const CreateBillPage = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return redirect("/login");
  }
  const membership = await prisma.householdMember.findFirst({
    where: { userId: user.id },
    include: {
      household: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!membership) {
    return (
      <div className="p-8 text-center">You must join a household first.</div>
    );
  }

  const members = membership.household.members.map((m) => ({
    id: m.user.id,
    name: m.user.name,
  }));

  const categories = await prisma.billCategory.findMany({
    where: { createdById: null }, // predefined only
  });

  return (
    <CreateBillForm
      members={members}
      categories={categories}
      currentUserId={user.id!}
    />
  );
};

export default CreateBillPage;
