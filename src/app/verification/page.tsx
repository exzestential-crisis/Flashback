"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import Nav from "@/app/components/Nav";
import { AnimatedButton } from "@/components";

export default function verification() {
  const router = useRouter();

  // ui
  const [values, setValues] = useState(Array(6).fill(""));
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef(
    Array.from({ length: 6 }, () => React.createRef<HTMLInputElement>())
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValues = [...values];
    newValues[index] = e.target.value.slice(0, 1); // Only allow one character
    setValues(newValues);

    if (e.target.value && index < 5) {
      inputRefs.current[index + 1]?.current?.focus(); // Safely focus next input
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && values[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1]?.current?.focus(); // Safely move focus back
      }
    }
  };

  // data
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  // Check for pending signup data on mount
  useEffect(() => {
    const pendingSignup = sessionStorage.getItem("pendingSignup");
    if (!pendingSignup) {
      // No pending signup data, redirect to signup
      router.push("/signup");
      return;
    }

    try {
      const signupData = JSON.parse(pendingSignup);
      setEmail(signupData.email);

      // Optional: Check if data is expired (e.g., older than 1 hour)
      const timestamp = signupData.timestamp;
      const oneHour = 60 * 60 * 1000;
      if (Date.now() - timestamp > oneHour) {
        sessionStorage.removeItem("pendingSignup");
        setError("Signup session expired. Please start over.");
        setTimeout(() => router.push("/signup"), 3000);
      }
    } catch (e) {
      console.error("Error parsing signup data:", e);
      router.push("/signup");
    }
  }, [router]);

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    const pendingSignup = sessionStorage.getItem("pendingSignup");
    if (!pendingSignup) {
      setError("Session expired. Please start signup again.");
      setTimeout(() => router.push("/signup"), 2000);
      return;
    }

    try {
      const signupData = JSON.parse(pendingSignup);

      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupData.email,
          username: signupData.username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Start cooldown timer
        setResendCooldown(60);
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        setError("");
        // Store the resend timestamp
        sessionStorage.setItem("lastResendTime", Date.now().toString());
      } else {
        setError(data.error || "Failed to resend verification code");
      }
    } catch (error) {
      console.error("Resend error:", error);
      setError("Failed to resend verification code");
    }
  };

  // Start cooldown on mount (in case user refreshes page)
  useEffect(() => {
    const lastResendTime = sessionStorage.getItem("lastResendTime");
    if (lastResendTime) {
      const timeSinceResend = Date.now() - parseInt(lastResendTime);
      const remainingCooldown = Math.max(0, 60000 - timeSinceResend) / 1000;

      if (remainingCooldown > 0) {
        setResendCooldown(Math.ceil(remainingCooldown));
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              sessionStorage.removeItem("lastResendTime");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const code = values.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    const pendingSignup = sessionStorage.getItem("pendingSignup");
    if (!pendingSignup) {
      setError("Session expired. Please start signup again.");
      setTimeout(() => router.push("/signup"), 2000);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const signupData = JSON.parse(pendingSignup);

      // Debug: Log the data being sent
      console.log("Sending signup data:", {
        username: signupData.username,
        email: signupData.email,
        password: "[HIDDEN]",
        user_type: signupData.user_type,
        interests: signupData.interests,
        code: code,
      });

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: signupData.username,
          email: signupData.email,
          password: signupData.password,
          user_type: signupData.user_type,
          interests: signupData.interests,
          code: code,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear the pending signup data
        sessionStorage.removeItem("pendingSignup");
        sessionStorage.removeItem("lastResendTime");

        // Redirect to success page or dashboard
        router.push("/home");
      } else {
        setError(data.error || "Verification failed. Please try again.");
        // Clear the form on error
        setValues(Array(6).fill(""));
        inputRefs.current[0]?.current?.focus();
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen w-full">
      <Nav />

      <div className="flex flex-col p-48 justify-center items-center">
        <h2 className="text-center text-xl font-bold p-4">
          Verify your account
        </h2>
        <h4 className="text-center">
          Please enter the 6-digit pin sent to your email
        </h4>
        {email && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            Code sent to: {email}
          </p>
        )}

        {/* Input Boxes */}
        <form className="pt-10" onSubmit={handleSubmit}>
          <div className="flex space-x-2 just">
            {values.map((value, index) => (
              <input
                key={index}
                type="text"
                value={value}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                ref={inputRefs.current[index]}
                disabled={isLoading}
                className="
                        w-16 h-16
                        text-center font-bold
                        border-4 border-zinc-100 dark:border-zinc-800 rounded-lg

                        bg-white dark:bg-zinc-600
                        shadow-[0_6px_0_theme('colors.zinc.100')] dark:shadow-[0_6px_0_theme('colors.zinc.800')]
                        hover:bg-zinc-100 hover:border-zinc-200 hover:shadow-[0_6px_0_theme('colors.zinc.200')] hover:translate-y-[1px] 
                        dark:hover:bg-zinc-700 dark:hover:border-zinc-800 dark:hover:shadow-[0_6px_0_theme('colors.zinc.800')]

                        focus:outline-none focus:ring-0
                        "
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleResendCode}
            className="text-xs my-4 hover:underline text-zinc-600 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={resendCooldown > 0 || isLoading}
          >
            {resendCooldown > 0
              ? `Didn't get an email? Resend verification code in ${resendCooldown}s`
              : "Didn't get an email? Resend verification code"}
          </button>

          <div className="p-10">
            <AnimatedButton
              type="submit"
              text={isLoading ? "Verifying..." : "Submit"}
              fullWidth
              disabled={isLoading || values.join("").length !== 6}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
