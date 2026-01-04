"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateWithdrawalModal } from "./create-withdrawal-modal";
import { DepositModal } from "./deposit-modal";
import { Wallet, Plus } from "lucide-react";

interface FinanceHeaderProps {
  balance: number;
  onWithdrawalCreated?: () => void;
}

export function FinanceHeader({
  balance,
  onWithdrawalCreated,
}: FinanceHeaderProps) {
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  return (
    <>
      <section className="mb-8 section-title">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-semibold text-3xl text-foreground mb-2">
              Finance Management
            </h1>
            <p className="text-lg text-muted-foreground">
              View your wallet balance, earnings, and transaction history
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDepositModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Deposit
            </Button>
            <Button onClick={() => setWithdrawalModalOpen(true)}>
              <Wallet className="mr-2 h-4 w-4" />
              Create Withdrawal Request
            </Button>
          </div>
        </div>
      </section>

      <DepositModal
        open={depositModalOpen}
        onOpenChange={setDepositModalOpen}
        onSuccess={onWithdrawalCreated}
      />

      <CreateWithdrawalModal
        open={withdrawalModalOpen}
        onOpenChange={setWithdrawalModalOpen}
        onSuccess={onWithdrawalCreated}
        balance={balance}
      />
    </>
  );
}
