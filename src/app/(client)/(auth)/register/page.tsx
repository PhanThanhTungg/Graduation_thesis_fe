import Link from 'next/link'
import { RegisterForm } from './_components/register-form'
import Logo from '@/components/custom/logo'
import { RecaptchaProvider } from '@/components/providers/recaptcha-provider'

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-foreground via-background to-mint/10">
      <div className="container-md py-12">
        <div className="flex flex-col items-center space-y-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="size-10 bg-green rounded-lg flex items-center justify-center">
              <span className="text-white font-heading text-xl font-bold">A</span>
            </div>
            <Logo />
          </Link>

          <RecaptchaProvider>
            <RegisterForm />
          </RecaptchaProvider>
        </div>
      </div>
    </main>
  )
}
