import { Suspense } from "react"
import ResetPasswordForm from "./_components/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-green-foreground p-4">
        <div className="w-full max-w-xl">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
