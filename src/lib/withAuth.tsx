"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase/supabaseClient";

export function withAuth(Component: any) {
  return function ProtectedPage(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);

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
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return <Component {...props} session={session} />;
  };
}
