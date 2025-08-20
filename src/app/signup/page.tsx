"use client";

import dynamic from "next/dynamic";
import AuthSkeleton from "@/components/forms/AuthSkeleton";

const SignupForm = dynamic(() => import("@/components/forms/SignupForm"), {
  ssr: false,
  loading: () => <AuthSkeleton />,
});

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignupForm />
    </div>
  );
}
