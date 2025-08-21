"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase/supabaseClient";

export function withoutAuth(Component: any) {
  return function PublicOnlyPage(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          router.replace("/");
        }
        setLoading(false);
      };

      checkSession();
    }, [router]);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      );
    }

    return <Component {...props} />;
  };
}
