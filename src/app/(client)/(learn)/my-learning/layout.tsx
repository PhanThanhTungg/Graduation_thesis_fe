import ClientFooter from "@/components/custom/client-footer";
import ClientHeader from "@/components/custom/client-header";
import { MyLearningWrapper } from "./_components/my-learning-wrapper";

export default function MyLearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClientHeader />
      <MyLearningWrapper>{children}</MyLearningWrapper>
      <ClientFooter />
    </>
  );
}
