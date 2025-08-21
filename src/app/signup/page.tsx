"use client";

import SignupForm from "@/components/forms/SignupForm";
import { withoutAuth } from "@/lib/withoutAuth";

function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignupForm />
    </div>
  );
}

export default withoutAuth(SignupPage);
