import { getMonthlyBills } from "@/lib/actions/bills.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
import { format } from "date-fns";
import BillDetailDialog from "@/components/shared/bills/bill-detail-dialog";
import { getCurrentUser } from "@/lib/actions/user.actions";

const BillOverviewPage = async () => {
  const bills = await getMonthlyBills();
  console.log(bills);

  const user = await getCurrentUser();
  if (!user)
    return (
      <div>
        <p>You are not logged in!</p>
      </div>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Paid By</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bills.map((bill) => (
          <TableRow key={bill.id}>
            <TableCell>{bill.title}</TableCell>
            <TableCell>${bill.amount.toFixed(2)}</TableCell>
            <TableCell>{bill.category?.name ?? "Uncategorized"}</TableCell>
            <TableCell>{bill.paidBy.name}</TableCell>
            <TableCell>
              {format(new Date(bill.createdAt), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              {bill.isSettled ? (
                <span className="text-green-600">Settled ✅</span>
              ) : (
                <span className="text-yellow-600">Waiting for Payment 🟡</span>
              )}
            </TableCell>
            <TableCell>
              <BillDetailDialog billId={bill.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BillOverviewPage;
