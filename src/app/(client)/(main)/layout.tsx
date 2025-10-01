import ClientFooter from "@/components/custom/client-footer";
import ClientHeader from "@/components/custom/client-header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClientHeader/>
      <main>
        {children}
      </main>
      <ClientFooter />
    </>
  )
}