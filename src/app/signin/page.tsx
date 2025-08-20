"use client";

import dynamic from "next/dynamic";
import AuthSkeleton from "@/components/forms/AuthSkeleton";

const SigninForm = dynamic(() => import("@/components/forms/SigninForm"), {
  ssr: false,
  loading: () => <AuthSkeleton />,
});

export default function SigninPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SigninForm />
    </div>
  );
}
