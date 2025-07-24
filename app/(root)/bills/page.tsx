import BillOverviewPage from "./bill-overview";

export default async function BillsPage() {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Bills – This Month</h1>
      <BillOverviewPage />
    </div>
  );
}
