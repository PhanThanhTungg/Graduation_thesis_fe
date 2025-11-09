"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { ForgotPasswordSchema, ForgotPasswordType } from "@/schema/user.schema"
import { forgotPassword } from "@/service/auth.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(ForgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordType) => {
    const result = await forgotPassword(data.email)
    if (result.ok) {
      setEmail(data.email)
      setIsSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-foreground p-4">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center">
            {isSubmitted
              ? "Check your email"
              : "Enter your email to reset your password"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full bg-green" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <Alert className="border-green bg-green-foreground">
              <CheckCircle2 className="h-5 w-5 text-green" />
              <AlertTitle className="text-green font-semibold">
                Request Sent Successfully!
              </AlertTitle>
              <AlertDescription className="text-foreground">
                We've sent a password reset link to <strong>{email}</strong>.
                Please check your inbox and follow the instructions to reset
                your password.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            <Link
              href="/login"
              className="hover:text-primary underline underline-offset-4 transition-colors"
            >
              Back to Login
            </Link>
          </div>

          {isSubmitted && (
            <div className="text-center text-sm text-muted-foreground">
              Didn't receive the email?{" "}
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-primary hover:underline underline-offset-4 font-medium transition-colors"
              >
                Try again
              </button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
