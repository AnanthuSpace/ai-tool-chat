"use client";

import { useEffect, useState, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase/supabaseClient";

export function withoutAuth<P extends object>(Component: ComponentType<P>) {
  return function PublicOnlyPage(props: P) {
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
