import { Metadata } from "next";
import {
  getWallet,
  getTransactions,
  getWithdrawals,
} from "@/service/finance.service";
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

export const metadata: Metadata = {
  title: "Finance - Teacher Space",
  description: "Manage your finance and transactions",
};

export default async function FinancePage() {
  let wallet;
  let transactions;
  let withdrawals;

  try {
    wallet = await getWallet();
    transactions = await getTransactions({ limit: 10 });
    withdrawals = await getWithdrawals({ limit: 10 });
  } catch (error) {
    console.error("Failed to fetch finance data:", error);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
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
    <div className="container-lg py-12">
      <section className="mb-8">
        <h1 className="font-heading font-semibold text-3xl text-foreground mb-2">
          Finance Management
        </h1>
        <p className="text-lg text-muted-foreground">
          View your wallet balance, earnings, and transaction history
        </p>
      </section>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Requests</CardTitle>
            <CardDescription>Your withdrawal request history</CardDescription>
          </CardHeader>
          <CardContent>
            {withdrawals && withdrawals.withdrawals.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell className="font-medium">
                        {formatPrice(withdrawal.amount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {withdrawal.bankName || "N/A"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(withdrawal.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No withdrawal requests found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
