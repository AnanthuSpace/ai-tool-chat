"use client";

import { withAuth } from "@/lib/withAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default withAuth(Dashboard);
