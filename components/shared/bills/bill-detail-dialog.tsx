import { getBillById } from "@/lib/actions/bills.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";
// import { getUserStatusInBill } from "@/lib/actions/bills.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

interface BillDetailsProps {
  billId: string;
}

export default async function BillDetailDialog({ billId }: BillDetailsProps) {
  const bill = await getBillById(billId);
  const currentUser = await getCurrentUser();

  if (!bill || !currentUser) return notFound();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{bill.title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Created on {format(new Date(bill.createdAt), "PPP")}
          </p>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          <p>
            <strong>Total Amount:</strong> ${bill.amount.toFixed(2)}
          </p>
          <p>
            <strong>Paid by:</strong>{" "}
            {bill.paidBy.id === currentUser.id ? "You" : bill.paidBy.name}
          </p>
          {bill.description && (
            <p>
              <strong>Description:</strong> {bill.description}
            </p>
          )}
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Participants</h3>
          <div className="space-y-3">
            {bill.billSplits.map(async (split) => {
              // const status = await getUserStatusInBill(bill.id, split.userId);
              const isCurrentUser = currentUser.id === split.userId;

              return (
                <div key={split.id} className="border p-3 rounded">
                  <p className="font-medium">
                    {isCurrentUser ? "You" : split.user.name}
                  </p>
                  <p className="text-sm">
                    Owes: ${split.amountOwed.toFixed(2)}
                  </p>

                  {/* <p className="text-sm">Has Paid:</p>
                  <Checkbox
                    checked={status?.paid}
                    disabled={!isCurrentUser}
                    onCheckedChange={(val) => {
                      const checked = val === true;
                      updateBillStatus({
                        billId,
                        userId: split.user.id,
                        hasPaid: checked,
                        paymentConfirmed: status?.confirmed, // preserve current state
                      });
                    }}
                  />
                  <p className="text-sm">Confirmed:</p>
                  <Checkbox
                    checked={status?.paid}
                    disabled={!isCurrentUser}
                    onChange={(val) => {
                      const checked = val === true;
                      updateBillStatus({
                        billId,
                        userId: split.user.id,
                        hasPaid: status?.paid,
                        paymentConfirmed: checked, // preserve current state
                      });
                    }}
                  /> */}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
