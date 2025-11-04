import { LoginForm } from "./_components";
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-foreground via-background to-mint/10">
      <div className="container-md py-12">
        <div className="flex flex-col items-center space-y-6">
          <Link href="/admin/login" className="flex items-center space-x-2">
            <div className="size-10 bg-green rounded-lg flex items-center justify-center">
              <span className="text-white font-heading text-xl font-bold">A</span>
            </div>
            <span className="font-heading text-2xl font-bold">Aikabis</span>
          </Link>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground max-w-md">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-green hover:text-green/80 transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-green hover:text-green/80 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}