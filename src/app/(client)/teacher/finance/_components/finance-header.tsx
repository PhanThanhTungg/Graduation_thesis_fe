"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateWithdrawalModal } from "./create-withdrawal-modal";
import { Wallet } from "lucide-react";

interface FinanceHeaderProps {
  balance: number;
  onWithdrawalCreated?: () => void;
}

export function FinanceHeader({
  balance,
  onWithdrawalCreated,
}: FinanceHeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);

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
          <Button onClick={() => setModalOpen(true)}>
            <Wallet className="mr-2 h-4 w-4" />
            Create Withdrawal Request
          </Button>
        </div>
      </section>

      <CreateWithdrawalModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={onWithdrawalCreated}
        balance={balance}
      />
    </>
  );
}
