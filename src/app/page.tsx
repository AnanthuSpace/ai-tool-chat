"use client";

import { withAuth } from "@/lib/withAuth";

function Dashboard({ session }: { session: any }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {session?.user?.email}</h1>
      <p>This is a protected dashboard page.</p>
    </div>
  );
}

export default withAuth(Dashboard);
