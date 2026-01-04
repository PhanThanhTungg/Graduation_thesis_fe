import { Metadata } from "next";
import { getWallet, getTransactions } from "@/service/finance.service";
import { formatPrice } from "@/lib/utils";
import { formatDate } from "@/lib/helpers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StudentOrders } from "./_components/student-orders";
import { FinanceHeader } from "./_components/finance-header";

export const metadata: Metadata = {
  title: "Finance - Teacher Space",
  description: "Manage your finance and transactions",
};

export default async function FinancePage() {
  let wallet;
  let transactions;

  try {
    wallet = await getWallet();
    transactions = await getTransactions({ limit: 10 });
  } catch (error) {
    console.error("Failed to fetch finance data:", error);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "success":
        return "text-green";
      case "processing":
        return "text-yellow";
      case "pending":
        return "text-orange";
      case "cancelled":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    const color = getStatusColor(status);
    return <span className={`capitalize ${color} font-medium`}>{status}</span>;
  };

  return (
    <div className="container-sm py-12">
      {wallet && <FinanceHeader balance={wallet.balance} />}

      {wallet && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatPrice(wallet.balance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green">
                {formatPrice(wallet.totalEarned)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange">
                {formatPrice(wallet.totalSpent)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Deposited
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-violet">
                {formatPrice(wallet.totalDeposited)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Withdrawn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">
                {formatPrice(wallet.totalWithdrawn)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-8">
        <StudentOrders />

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions && transactions.transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="capitalize">
                        {transaction.type}
                      </TableCell>
                      <TableCell
                        className={
                          transaction.type === "deposit"
                            ? "text-green font-medium"
                            : "text-orange font-medium"
                        }
                      >
                        {transaction.type === "deposit" ? "+" : "-"}
                        {formatPrice(Math.abs(transaction.amount))}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
