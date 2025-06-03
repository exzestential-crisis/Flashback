import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  username: string;
}

interface SessionData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useSession() {
  const [session, setSession] = useState<SessionData>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch("/api/auth/session");

      if (response.ok) {
        const userData = await response.json();
        setSession({
          user: userData.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setSession({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setSession({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setSession({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    ...session,
    logout,
    refreshSession: checkSession,
  };
}
