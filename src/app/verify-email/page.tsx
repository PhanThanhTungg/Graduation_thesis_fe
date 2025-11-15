import { Suspense } from "react";
import VerifyEmailClient from "./_components/verify-email-client";

export default function VerifyEmailPage() {
  return (
    <div className="container-sm py-16">
      <div className="max-w-lg mx-auto">
        <Suspense fallback={
          <div className="p-8 border border-border rounded-2xl bg-card text-center">
            <p>Loading...</p>
          </div>
        }>
          <VerifyEmailClient />
        </Suspense>
      </div>
    </div>
  );
}


