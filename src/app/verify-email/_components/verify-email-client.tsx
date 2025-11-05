"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { verifyEmail } from "@/service/auth.service";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; message?: string }>(null);

  const handleVerify = async () => {
    if (!token || isVerifying) return;
    setIsVerifying(true);
    try {
      const res = await verifyEmail(token);
      setResult(res);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="p-8 border border-border rounded-2xl bg-card text-center">
      {!result ? (
        <>
          <h1 className="font-heading font-semibold text-2xl text-foreground mb-2">Verify your email</h1>
          <p className="text-muted-foreground mb-6">Click the button below to verify your email address</p>
          <Button
            type="button"
            onClick={handleVerify}
            className="h-11 px-6 text-base bg-green hover:bg-green/90 text-white"
            disabled={!token || isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
          {!token && (
            <p className="text-sm text-destructive mt-4">Missing token</p>
          )}
        </>
      ) : result.ok ? (
        <>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 className="size-8 text-green" />
          </div>
          <h2 className="font-heading font-semibold text-xl text-foreground mb-2">Email verified successfully</h2>
          <p className="text-muted-foreground mb-6">Your email has been verified. You can go back to your profile now</p>
          <Link href="/profile">
            <Button type="button" variant="outline" className="h-11 px-6 text-base">Back to Profile</Button>
          </Link>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center mb-4">
            <XCircle className="size-8 text-destructive" />
          </div>
          <h2 className="font-heading font-semibold text-xl text-foreground mb-2">Verification failed</h2>
          <p className="text-muted-foreground mb-6">{result.message || "Unable to verify your email. Please try again later"}</p>
          <Link href="/profile">
            <Button type="button" variant="outline" className="h-11 px-6 text-base">Back to Profile</Button>
          </Link>
        </>
      )}
    </div>
  );
}


