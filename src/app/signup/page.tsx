"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import { AnimatedButton, ArrowBack, LightButton, Input } from "@/components";
import Nav from "../components/Nav";
import { Facebook, Google } from "../../../public/assets/logos";
import { useNotification } from "@/contexts/NotificationContext";

export default function signup() {
  const router = useRouter();

  // ui
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // data
  type FormData = {
    user_type: string;
    username: string;
    email: string;
    password: string;
    interests: string[];
  };
  const [form, setForm] = useState<FormData>({
    user_type: "",
    username: "",
    email: "",
    password: "",
    interests: [],
  });
  const [emailRequirementsMet, setEmailRequirementsMet] = useState({
    hasAtSymbol: false,
    validDomain: false,
  });
  const emailRequirements = {
    hasAtSymbol: /@/,
    validDomain: /\.[a-z]{2,}$/i, // basic domain check like .com or .org
  };
  const [passwordRequirementsMet, setPasswordRequirementsMet] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });
  const passwordRequirements = {
    length: /.{8,}/, // at least 8 characters
    uppercase: /[A-Z]/, // contains uppercase
    lowercase: /[a-z]/, // contains lowercase
    number: /\d/, // contains number
  };

  const handleFormChange = (key: string, value: string) => {
    setForm((prevForm) => ({ ...prevForm, [key]: value }));
  };

  const toggleInterest = (interest: string) => {
    setForm((prev: FormData) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;

    setForm((prevForm) => ({ ...prevForm, email: newEmail }));

    setEmailRequirementsMet({
      hasAtSymbol: emailRequirements.hasAtSymbol.test(newEmail),
      validDomain: emailRequirements.validDomain.test(newEmail),
    });
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setForm((prevForm) => ({ ...prevForm, password: newPassword }));

    setPasswordRequirementsMet({
      length: passwordRequirements.length.test(newPassword),
      uppercase: passwordRequirements.uppercase.test(newPassword),
      lowercase: passwordRequirements.lowercase.test(newPassword),
      number: passwordRequirements.number.test(newPassword),
    });
  };

  const isFormComplete =
    passwordRequirementsMet.length &&
    passwordRequirementsMet.uppercase &&
    passwordRequirementsMet.lowercase &&
    passwordRequirementsMet.number &&
    emailRequirementsMet.hasAtSymbol &&
    emailRequirementsMet.validDomain;

  const userType = [
    {
      name: "Teacher",
      imgSrc: "http://placehold.co/100",
    },
    {
      name: "Student",
      imgSrc: "http://placehold.co/100",
    },
    {
      name: "Other",
      imgSrc: "http://placehold.co/100",
    },
  ];

  const interestItems = [
    { name: "Math", imgSrc: "http://placehold.co/100" },
    { name: "Science", imgSrc: "http://placehold.co/100" },
    { name: "History", imgSrc: "http://placehold.co/100" },
    { name: "Medicine", imgSrc: "http://placehold.co/100" },
    { name: "Geography", imgSrc: "http://placehold.co/100" },
    { name: "English", imgSrc: "http://placehold.co/100" },
    { name: "Programming", imgSrc: "http://placehold.co/100" },
    { name: "Art", imgSrc: "http://placehold.co/100" },
    { name: "Music", imgSrc: "http://placehold.co/100" },
    { name: "Languages", imgSrc: "http://placehold.co/100" },
    { name: "Business", imgSrc: "http://placehold.co/100" },
    { name: "Finance", imgSrc: "http://placehold.co/100" },
    { name: "Psychology", imgSrc: "http://placehold.co/100" },
    { name: "Law", imgSrc: "http://placehold.co/100" },
    { name: "Philosophy", imgSrc: "http://placehold.co/100" },
    { name: "Technology", imgSrc: "http://placehold.co/100" },
    { name: "Environment", imgSrc: "http://placehold.co/100" },
    { name: "Space", imgSrc: "http://placehold.co/100" },
    { name: "Sports", imgSrc: "http://placehold.co/100" },
    { name: "Trivia", imgSrc: "http://placehold.co/100" },
  ];

  // navigation
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  const [fadeNextClass, setFadeNextClass] = useState("fade-in");
  const [showContinueButton, setShowContinueButton] = useState(true);
  const [direction, setDirection] = useState<"forward" | "backward" | "">("");
  const goToStep = (targetStep: number) => {
    if (animating || targetStep === step) return;

    const isForward = targetStep > step;
    setDirection(isForward ? "forward" : "backward");
    setAnimating(true);

    setAnimationClass(isForward ? "slide-out-left" : "slide-out-right");

    setTimeout(() => {
      setStep(targetStep);

      setAnimationClass(isForward ? "slide-in-right" : "slide-in-left");

      setTimeout(() => {
        setAnimating(false);
        setAnimationClass("");
      }, 500);
    }, 500);
  };

  useEffect(() => {
    if (step < 2) {
      setShowContinueButton(true);
      setFadeNextClass("fade-in");
    } else {
      setFadeNextClass("fade-out");
      setTimeout(() => setShowContinueButton(false), 300);
    }
  }, [step]);

  const canContinue = () => {
    if (step === 0) {
      return form.user_type !== "";
    } else if (step === 1) {
      return form.interests.length > 0;
    }
    return true;
  };

  //Form Submission
  const handleSignupClick = async () => {
    if (!isFormComplete) return;

    setIsLoading(true);

    try {
      // Store form data in sessionStorage for verification page
      const signupData = {
        username: form.username,
        email: form.email,
        password: form.password,
        user_type: form.user_type,
        interests: form.interests,
        timestamp: Date.now(), // Add timestamp for expiration if needed
      };

      sessionStorage.setItem("pendingSignup", JSON.stringify(signupData));

      // Send verification email
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email, username: form.username }),
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to verification page
        router.push("/verification");
      } else {
        addNotification(
          data.error || "Failed to send verification email",
          "error"
        );

        return;
      }
    } catch (error) {
      console.error("Signup error:", error);
      addNotification("An error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-x-hidden">
      <Nav />

      {/* Back Button */}
      {step > 0 && (
        <div className="absolute lg:top-30 lg:left-40">
          <button
            onClick={() => goToStep(step - 1)}
            disabled={animating}
            className="fixed z-10"
          >
            <ArrowBack />
          </button>
        </div>
      )}

      {/* User type */}
      {step === 0 && (
        <div
          className={`flex flex-col items-center min-h-screen w-full transition ${animationClass}`}
        >
          <div className="absolute top-1/4">
            <h2 className="text-center text-xl font-bold mb-10">I am a ...</h2>

            {/* User type mapping */}
            <div className="grid grid-cols-3 gap-20">
              {userType.map((type) => (
                <button
                  key={type.name}
                  onClick={() => handleFormChange("user_type", type.name)}
                  className={`
                    flex flex-col items-center
                    w-52 pt-10 pb-8 rounded-lg
                    text-sm text-slate-900 dark:text-white
                    focus:outline-none focus:ring-0
                    
                    transition
                    ${
                      form.user_type === type.name
                        ? `
                          bg-zinc-100 dark:bg-zinc-800
                          shadow-[0_-6px_0_theme('colors.zinc.200')] dark:shadow-[0_-6px_0_theme('colors.zinc.900')]
                          translate-y-2`
                        : `
                          border-4 border-zinc-100 dark:border-zinc-800

                          bg-white dark:bg-zinc-600
                          shadow-[0_6px_0_theme('colors.zinc.100')] dark:shadow-[0_6px_0_theme('colors.zinc.800')]
                          hover:bg-zinc-100 hover:border-zinc-200 hover:shadow-[0_6px_0_theme('colors.zinc.200')] hover:translate-y-[1px] 
                          dark:hover:bg-zinc-700 dark:hover:border-zinc-800 dark:hover:shadow-[0_6px_0_theme('colors.zinc.800')]
                          

                          transition-transform 
                          focus:outline-none focus-visible:outline-none active:outline-none
                          focus:translate-y-2 
                        `
                    }
                  `}
                >
                  <img src={type.imgSrc} alt={type.name} className="pb-3" />
                  <span>{type.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Interests */}
      {step === 1 && (
        <div
          className={`flex flex-col items-center min-h-screen w-full transition ${animationClass}`}
        >
          <div className="absolute top-1/4">
            <h2 className="text-center text-xl font-bold">
              What are you interested in?
            </h2>
            <h3 className="text-center text-md text-zinc-500 mb-10">
              Choose atleast 1
            </h3>
            <div className="grid grid-cols-4 gap-14 place-items-center mb-32">
              {interestItems.map((item) => {
                const isPressedStyle = form.interests.includes(item.name);

                return (
                  <button
                    key={item.name}
                    onClick={() => toggleInterest(item.name)}
                    className={`
                        flex flex-col items-center
                        w-32 h-32 pt-6 rounded-lg
                        text-sm text-slate-900 dark:text-white
                        focus:outline-none focus:ring-0

                        transition-transform
                        ${
                          isPressedStyle
                            ? `
                              bg-zinc-100 dark:bg-zinc-800
                              shadow-[0_-6px_0_theme('colors.zinc.200')] dark:shadow-[0_-6px_0_theme('colors.zinc.900')]
                              translate-y-2`
                            : `
                              border-4 border-zinc-100 dark:border-zinc-800

                              bg-white dark:bg-zinc-600
                              shadow-[0_6px_0_theme('colors.zinc.100')] dark:shadow-[0_6px_0_theme('colors.zinc.800')]
                              hover:bg-zinc-100 hover:border-zinc-200 hover:shadow-[0_6px_0_theme('colors.zinc.200')] hover:translate-y-[1px] 
                            dark:hover:bg-zinc-700 dark:hover:border-zinc-800 dark:hover:shadow-[0_6px_0_theme('colors.zinc.800')]                            `
                        }
                      `}
                  >
                    <img
                      src={item.imgSrc}
                      alt={item.name}
                      className="w-14 mx-auto pb-1"
                    />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Signup Form */}
      {step === 2 && (
        <div
          className={`relative flex flex-col items-center min-h-screen w-full pt-40 transition ${animationClass} overflow-hidden`}
        >
          <div className="absolute top-5/12 slide-up flex flex-col w-1/4 items-center">
            <h2 className="text-center text-2xl font-bold mb-4">
              Great! Let's set up your account!
            </h2>

            {/* Delayed Fade in Form */}
            <div className="fade-in-delayed w-4/5">
              {/* Form */}

              <div className="flex flex-col">
                <Input
                  type="email"
                  value={form.email}
                  onChange={handleEmailChange}
                  placeholder="Email"
                  variant="plain"
                  className="lg:mt-4"
                  required
                />

                {/* Email requirements */}
                {form.email &&
                  (!emailRequirementsMet.hasAtSymbol ||
                    !emailRequirementsMet.validDomain) && (
                    <p className="text-sm text-rose-500 lg:mt-2">
                      Please enter a valid email address
                    </p>
                  )}

                <Input
                  type="text"
                  value={form.username}
                  onChange={(e) => handleFormChange("username", e.target.value)}
                  placeholder="Username"
                  variant="plain"
                  className="lg:mt-4"
                  required
                />

                <Input
                  type="password"
                  value={form.password}
                  onChange={handlePasswordChange}
                  placeholder="Password"
                  variant="plain"
                  className="lg:mt-4"
                  showPasswordToggle
                  required
                />

                {/* Password Requirements */}
                {form.password &&
                  (!passwordRequirementsMet.length ||
                    !passwordRequirementsMet.uppercase ||
                    !passwordRequirementsMet.lowercase ||
                    !passwordRequirementsMet.number) && (
                    <div className="flex flex-col lg:mt-2">
                      <p
                        className={`text-sm ${
                          passwordRequirementsMet.length
                            ? "text-green-400"
                            : "text-rose-500"
                        }`}
                      >
                        At least 8 characters
                      </p>
                      <p
                        className={`text-sm ${
                          passwordRequirementsMet.uppercase
                            ? "text-green-400"
                            : "text-rose-500"
                        }`}
                      >
                        At least 1 uppercase character
                      </p>
                      <p
                        className={`text-sm ${
                          passwordRequirementsMet.lowercase
                            ? "text-green-400"
                            : "text-rose-500"
                        }`}
                      >
                        At least 1 lowercase character
                      </p>
                      <p
                        className={`text-sm ${
                          passwordRequirementsMet.number
                            ? "text-green-400"
                            : "text-rose-500"
                        }`}
                      >
                        At least 1 number
                      </p>
                    </div>
                  )}

                <AnimatedButton
                  text="Signup"
                  style="mt-4"
                  onClick={handleSignupClick}
                  disabled={!isFormComplete || isLoading}
                  fullWidth
                />
              </div>

              {/* Api log in */}
              <div>
                <div className="grid grid-cols-7 items-center gap-4 py-4 dark:text-zinc-400">
                  <hr className="col-span-3" />
                  <p className="text-center">or</p>
                  <hr className="col-span-3" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <LightButton
                    text="Facebook"
                    img={Facebook}
                    imgClass="h-5 rounded-full me-2"
                    fullWidth
                  />
                  <LightButton
                    text="Google"
                    img={Google}
                    imgClass="h-5 rounded-full me-2"
                    fullWidth
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 text-center mt-8 text-black/40 dark:text-zinc-400">
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
      )}

      {/* Continue Button */}
      {showContinueButton && (
        <div className={`fixed bottom-20 right-20 ${fadeNextClass}`}>
          <AnimatedButton
            text="Continue"
            onClick={() => goToStep(step + 1)}
            disabled={animating || !canContinue()}
            style="px-14 py-4"
            textSize="text-xl"
          />
        </div>
      )}
    </div>
  );
}
