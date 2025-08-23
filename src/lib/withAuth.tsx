"use client";

import { useEffect, useState, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase/supabaseClient";
import type { Session } from "@supabase/supabase-js";

export function withAuth<P extends object>(
  Component: ComponentType<P & { session: Session | null }>
) {
  return function ProtectedPage(props: P) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
      const getSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          router.push("/signin");
        } else {
          setSession(data.session);
        }
        setLoading(false);
      };

      getSession();
    }, [router]);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      );
    }

    return <Component {...props} session={session} />;
  };
}
