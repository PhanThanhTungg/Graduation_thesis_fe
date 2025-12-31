export type TransactionType = "deposit" | "withdrawal";
export type TransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled";

export interface TransactionListItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: TransactionStatus;
  description: string | null;
  referenceId: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export const getTransactions = (): TransactionListItem[] => {
  const users = [
    { id: "1", name: "John Smith", email: "john.smith@example.com" },
    { id: "2", name: "Emily Johnson", email: "emily.johnson@example.com" },
    { id: "3", name: "Michael Brown", email: "michael.brown@example.com" },
    { id: "4", name: "Sarah Davis", email: "sarah.davis@example.com" },
    { id: "5", name: "David Wilson", email: "david.wilson@example.com" },
    {
      id: "6",
      name: "Jessica Martinez",
      email: "jessica.martinez@example.com",
    },
    {
      id: "7",
      name: "Christopher Anderson",
      email: "christopher.anderson@example.com",
    },
    { id: "8", name: "Amanda Taylor", email: "amanda.taylor@example.com" },
  ];

  const types: TransactionType[] = ["deposit", "withdrawal"];
  const statuses: TransactionStatus[] = [
    "pending",
    "processing",
    "completed",
    "cancelled",
  ];

  const transactions: TransactionListItem[] = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = Math.round((50 + Math.random() * 500) * 100) / 100;
    const balanceBefore = Math.round((100 + Math.random() * 1000) * 100) / 100;
    const balanceAfter =
      type === "deposit" ? balanceBefore + amount : balanceBefore - amount;

    const date = new Date(now);
    date.setHours(date.getHours() - i * 2);

    const descriptions = {
      deposit: [
        "Wallet deposit via PayPal",
        "Account top-up",
        "Balance recharge",
        "Fund deposit",
      ],
      withdrawal: [
        "Withdrawal request",
        "Fund withdrawal",
        "Balance withdrawal",
        "Payout request",
      ],
    };

    transactions.push({
      id: `trans-${i + 1}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      type,
      amount,
      balanceBefore,
      balanceAfter,
      status,
      description:
        descriptions[type][
          Math.floor(Math.random() * descriptions[type].length)
        ],
      referenceId:
        status === "completed"
          ? `ref-${Math.random().toString(36).substr(2, 9)}`
          : null,
      createdAt: date.toISOString(),
      updatedAt:
        status !== "pending"
          ? new Date(date.getTime() + 30 * 60000).toISOString()
          : null,
    });
  }

  return transactions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};
