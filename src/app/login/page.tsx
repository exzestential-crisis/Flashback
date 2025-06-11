"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNotification } from "@/contexts/NotificationContext";
import { useHandleEnterPress } from "@/hooks/useHandleEnterPress";
import { useLoadingStore } from "@/store/LoadingStore";

import { AnimatedButton, LightButton, ArrowBack, Input } from "@/components";
import { Facebook, Google } from "../../../public";

export default function Login() {
  //ui
  const { isLoading, showLoading, hideLoading } = useLoadingStore();

  // data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { addNotification } = useNotification();

  // navigation
  const router = useRouter();
  const handleBackClick = () => {
    router.back();
  };

  // Form Submission
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      hideLoading();
      return;
    }

    showLoading();
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        addNotification(error.message, "error");
        return;
      }

      if (!data.user?.email_confirmed_at) {
        addNotification("Please verify your email before logging in", "error");
        return;
      }

      addNotification("Login successful!", "success");

      router.replace("/home");
    } catch (error) {
      console.error("Login error:", error);
      addNotification("Network error. Please try again.", "error");
    } finally {
      hideLoading();
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider: "google" | "facebook") => {
    showLoading();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });

      if (error) {
        addNotification(error.message, "error");
      }
    } catch (error) {
      console.error("Social login error:", error);
      addNotification("Social login failed. Please try again.", "error");
    } finally {
      hideLoading();
    }
  };

  const handleKeyPress = useHandleEnterPress({
    onSubmit: handleSubmit,
  });

  return (
    <div className="relative bg-sky-200 dark:bg-slate-900 min-h-screen w-full">
      <div className="p-10" onClick={handleBackClick}>
        <ArrowBack />
      </div>

      {/* Login Form */}
      <div className="absolute top-1/5 flex flex-col justify-center items-center w-full">
        <h1 className="text-2xl font-bold mb-5">Login</h1>

        <div className="flex flex-col items-center justify-center w-1/6">
          <form onKeyDown={handleKeyPress} className="w-full">
            <div className="flex flex-col gap-4 w-full">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                variant="blue"
                required
                disabled={isLoading}
              />

              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                variant="blue"
                showPasswordToggle
                required
                disabled={isLoading}
              />

              <div className="flex justify-center">
                <AnimatedButton
                  text={isLoading ? "Logging in..." : "Login"}
                  onClick={handleSubmit}
                  style="w-60"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Social Login */}
            <div className="w-full">
              <div className="grid grid-cols-7 items-center gap-4 p-4 mt-2 text-black/40 dark:text-zinc-400">
                <hr className="col-span-3" />
                <p className="text-center">or</p>
                <hr className="col-span-3" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <LightButton
                  text="Facebook"
                  img={Facebook}
                  imgClass="h-5 rounded-full me-2"
                  variant="colored"
                  fullWidth
                  disabled={isLoading}
                  onClick={() => handleSocialLogin("facebook")}
                />
                <LightButton
                  text="Google"
                  img={Google}
                  imgClass="h-5 rounded-full me-2"
                  variant="colored"
                  fullWidth
                  disabled={isLoading}
                  onClick={() => handleSocialLogin("google")}
                />
              </div>
            </div>
          </form>

          <div className="flex flex-col gap-4 text-center mt-4 text-black/40 dark:text-zinc-400 py-4">
            <p>
              By signing in to FlashBack, you agree to our Terms and Privacy
              Policy.
            </p>
            <p>
              This site is protected by reCAPTCHA Enterprise and the Google
              Privacy Policy and Terms of Service apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
