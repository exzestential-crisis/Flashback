"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export default function AuthDebug() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      console.log("Initial session:", session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      console.log("Auth state changed:", _event, session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800">
        Loading auth state...
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="text-sm space-y-1">
        <p>
          <strong>User:</strong> {user ? "Logged in" : "Not logged in"}
        </p>
        <p>
          <strong>User ID:</strong> {user?.id || "None"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || "None"}
        </p>
        <p>
          <strong>Email Confirmed:</strong>{" "}
          {user?.email_confirmed_at ? "Yes" : "No"}
        </p>
        <p>
          <strong>Session exists:</strong> {session ? "Yes" : "No"}
        </p>
        <p>
          <strong>Current URL:</strong>{" "}
          {typeof window !== "undefined" ? window.location.pathname : "Unknown"}
        </p>
      </div>

      {user && (
        <button
          onClick={() => supabase.auth.signOut()}
          className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
        >
          Sign Out
        </button>
      )}
    </div>
  );
}
