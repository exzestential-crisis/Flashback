import { supabase } from "./supabase";

const MAX_ATTEMPTS = 10;
const CODE_EXPIRY_MINUTES = 10;

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeVerificationCode(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase();
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

    // Delete any existing code for this email
    await supabase
      .from("verification_codes")
      .delete()
      .eq("email", normalizedEmail);

    // Insert new code
    const { error } = await supabase.from("verification_codes").insert([
      {
        email: normalizedEmail,
        code,
        expires_at: expiresAt.toISOString(),
        attempts: 0,
        used: false,
      },
    ]);

    if (error) {
      console.error("Error storing verification code:", error);
      return { success: false, error: "Failed to store verification code" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in storeVerificationCode: ", error);
    return { success: false, error: "Internal error" };
  }
}

export async function verifyCode(
  email: string,
  inputCode: string
): Promise<{ isValid: boolean; error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase();

    // get the verification code
    const { data: verificationData, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", normalizedEmail)
      .eq("used", false)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        // No rows returned
        return {
          isValid: false,
          error: "No verification code found. Please request a new one.",
        };
      }
      console.error("Error fetching verification code:", fetchError);
      return {
        isValid: false,
        error: "Error verifying code. Please try again.",
      };
    }

    // Check expiration
    if (new Date(verificationData.expires_at) < new Date()) {
      // Delete expired code
      await supabase
        .from("verification_codes")
        .delete()
        .eq("id", verificationData.id);

      return {
        isValid: false,
        error: "Verification code has expired. Please request a new one.",
      };
    }

    // Check attempts
    if (verificationData.attempts >= MAX_ATTEMPTS) {
      // Delete code after max attempts
      await supabase
        .from("verification_codes")
        .delete()
        .eq("id", verificationData.id);

      return {
        isValid: false,
        error: "Too many failed attempts. Please request a new code.",
      };
    }

    // Check code
    if (verificationData.code !== inputCode) {
      // Increment attempts
      await supabase
        .from("verification_codes")
        .update({ attempts: verificationData.attempts + 1 })
        .eq("id", verificationData.id);

      return { isValid: false, error: "Invalid verification code." };
    }

    // Success - mark as used
    await supabase
      .from("verification_codes")
      .update({ used: true })
      .eq("id", verificationData.id);

    return { isValid: true };
  } catch (error) {
    console.error("Error in verifyCode:", error);
    return { isValid: false, error: "Error verifying code. Please try again." };
  }
}

export async function hasActiveCode(email: string): Promise<boolean> {
  try {
    const normalizedEmail = email.toLowerCase();

    const { data, error } = await supabase
      .from("verification_codes")
      .select("expires_at")
      .eq("email", normalizedEmail)
      .eq("used", false)
      .gte("expires_at", new Date().toISOString())
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking active code:", error);
    }

    return !!data;
  } catch (error) {
    console.error("Error in hasActiveCode:", error);
    return false;
  }
}

// Cleanup function
export async function cleanupExpiredCodes(): Promise<void> {
  try {
    await supabase
      .from("verification_codes")
      .delete()
      .or(`expires_at.lt.${new Date().toISOString()},used.eq.true`);
  } catch (error) {
    console.error("Error cleaning up expired codes:", error);
  }
}
