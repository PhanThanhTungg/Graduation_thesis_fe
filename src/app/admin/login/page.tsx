import { LoginForm } from "./_components";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <h1 className="mb-6 text-4xl font-bold">Admin Login</h1>
      <LoginForm />
    </div>
  )
}