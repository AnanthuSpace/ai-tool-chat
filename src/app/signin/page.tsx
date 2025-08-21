"use client";

import SigninForm from "@/components/forms/SigninForm";
import { withoutAuth } from "@/lib/withoutAuth";

function SigninPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SigninForm />
    </div>
  );
}

export default withoutAuth(SigninPage);
