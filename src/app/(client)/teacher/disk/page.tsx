import { Metadata } from "next";
import { DiskContent } from "./_components/disk-content";

export const metadata: Metadata = {
  title: "Disk - Teacher Space",
  description: "Manage your disk space",
};

export default async function DiskPage() {
  return <DiskContent />;
}
