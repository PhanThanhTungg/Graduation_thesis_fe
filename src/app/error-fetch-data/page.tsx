import Link from 'next/link'
import { AlertCircle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Error Fetching Data',
  description: 'An error occurred while fetching data. Learn what you can do to resolve the issue.',
}

export default function ErrorFetchDataPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-lg border-border/50 shadow-xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-heading">
              Oops! Something Went Wrong
            </CardTitle>
            <CardDescription className="text-base">
              We encountered an error while fetching your data. This could be due to a network issue or a temporary problem with our servers.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm">What you can try:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green mt-0.5">•</span>
                <span>Check your internet connection and try again</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green mt-0.5">•</span>
                <span>Refresh the page to retry loading the data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green mt-0.5">•</span>
                <span>Clear your browser cache and cookies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green mt-0.5">•</span>
                <span>Wait a few minutes and try again later</span>
              </li>
            </ul>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            If the problem persists, please{' '}
            <Link href="/contact" className="text-green hover:text-green/80 font-medium transition-colors">
              contact our support team
            </Link>
            .
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pt-6">
          <Button
            asChild
            className="bg-green hover:bg-green/90 text-white"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}