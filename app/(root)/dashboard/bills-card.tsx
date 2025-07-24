import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  totalBills: number;
  amountOwing: number;
  amountOwed: number;
};

const BillsCard = ({ totalBills, amountOwing, amountOwed }: Props) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            ${totalBills.toFixed(2) || 0}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>You Owe</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-destructive">
            ${amountOwing.toFixed(2) || 0}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Others Owe You </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-destructive">
            ${amountOwed.toFixed(2) || 0}
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Link href="/bills/create">
          <Button variant="outline" size="lg">
            + Add New Bill
          </Button>
        </Link>

        <Link href="/bills/create">
          <Button variant="outline" size="lg">
            View All Bills
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BillsCard;
