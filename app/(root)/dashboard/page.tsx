import { getCurrentUser } from "@/lib/actions/user.actions";

import BillsCard from "./bills-card";
import HouseholdCard from "./household-card";
import TodayCard from "./today-card";
import {
  getMonthlyTotalBills,
  getTotalAmountOwed,
  getTotalAmountOwing,
} from "@/lib/actions/bills.actions";

export const metadata = {
  title: "Dashboard",
};

const DashboardPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <section className="wrapper space-y-4">
        <h1 className="text-2xl font-bold">Youre not signed in</h1>
        <p className="text-muted-foreground">
          Please sign in to view your dashboard.
        </p>
      </section>
    );
  }
  const [totalBills, amountOwing, amountOwed] = await Promise.all([
    getMonthlyTotalBills(),
    getTotalAmountOwing(),
    getTotalAmountOwed(),
  ]);
  const username = user.name === "Error" ? "User" : user.name;
  console.log(user);

  return (
    <section className="wrapper space-y-2">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {username}</h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening in your shared home:
        </p>
      </div>

      {/* 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Bills Section */}
        <BillsCard
          totalBills={totalBills}
          amountOwing={amountOwing}
          amountOwed={amountOwed}
        />

        {/* Middle Column */}
        <TodayCard />

        {/* Right Column */}
        <HouseholdCard />
      </div>
    </section>
  );
};

export default DashboardPage;
