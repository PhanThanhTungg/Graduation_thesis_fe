import Link from "next/link";
import { LoginForm } from "./_components/login-form";
import Logo from "@/components/custom/logo";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-foreground via-background to-mint/10">
      <div className="container-md py-12">
        <div className="flex flex-col items-center space-y-6">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground max-w-md">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="text-green hover:text-green/80 transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-green hover:text-green/80 transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
