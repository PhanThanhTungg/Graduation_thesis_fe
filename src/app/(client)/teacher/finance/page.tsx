import { Metadata } from "next";
import { getWallet } from "@/service/finance.service";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentOrders } from "./_components/student-orders";
import { FinanceHeader } from "./_components/finance-header";
import { RecentTransactions } from "./_components/recent-transactions";

export const metadata: Metadata = {
  title: "Finance - Teacher Space",
  description: "Manage your finance and transactions",
};

export default async function FinancePage() {
  let wallet;

  try {
    wallet = await getWallet();
  } catch (error) {
    console.error("Failed to fetch finance data:", error);
  }

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

        <RecentTransactions />
      </div>
    </div>
  );
}
