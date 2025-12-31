export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled";

export interface PaymentListItem {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  amount: number;
  status: PaymentStatus;
  bankName: string | null;
  bankAccount: string | null;
  bankAccountName: string | null;
  note: string | null;
  rejectionReason: string | null;
  processedBy: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export const getPayments = (): PaymentListItem[] => {
  const teachers = [
    { id: "1", name: "Nguyễn Văn An", email: "nguyenvanan@example.com" },
    { id: "2", name: "Trần Thị Bình", email: "tranthibinh@example.com" },
    { id: "3", name: "Lê Minh Cường", email: "leminhcuong@example.com" },
    { id: "4", name: "Phạm Thị Dung", email: "phamthidung@example.com" },
    { id: "5", name: "Hoàng Văn Đức", email: "hoangvanduc@example.com" },
    { id: "6", name: "Vũ Thị Hoa", email: "vuthihoa@example.com" },
    { id: "7", name: "Đặng Văn Hùng", email: "dangvanhung@example.com" },
    { id: "8", name: "Bùi Thị Lan", email: "buithilan@example.com" },
  ];

  const statuses: PaymentStatus[] = [
    "pending",
    "processing",
    "completed",
    "cancelled",
  ];
  const banks = [
    "Vietcombank",
    "BIDV",
    "VietinBank",
    "Techcombank",
    "ACB",
    "TPBank",
    "MBBank",
    "VPBank",
  ];

  const payments: PaymentListItem[] = [];
  const now = new Date();

  for (let i = 0; i < 45; i++) {
    const teacher = teachers[Math.floor(Math.random() * teachers.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = Math.round((100 + Math.random() * 2000) * 100) / 100;
    const bankName =
      status !== "pending"
        ? banks[Math.floor(Math.random() * banks.length)]
        : null;
    const bankAccount = bankName
      ? `****${Math.floor(1000 + Math.random() * 9000)}`
      : null;
    const bankAccountName = bankName ? teacher.name : null;

    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(i / 2));
    date.setHours(date.getHours() - (i % 24));

    const processedAt =
      status === "completed" || status === "cancelled"
        ? new Date(
            date.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000,
          ).toISOString()
        : null;

    payments.push({
      id: `payment-${i + 1}`,
      teacherId: teacher.id,
      teacherName: teacher.name,
      teacherEmail: teacher.email,
      amount,
      status,
      bankName,
      bankAccount,
      bankAccountName,
      note: Math.random() > 0.7 ? "Urgent withdrawal request" : null,
      rejectionReason:
        status === "cancelled" && Math.random() > 0.5
          ? "Invalid bank account information"
          : null,
      processedBy: processedAt
        ? `admin-${Math.floor(Math.random() * 3) + 1}`
        : null,
      processedAt,
      createdAt: date.toISOString(),
      updatedAt: processedAt,
    });
  }

  return payments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};
