import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";
import {
  generateVerificationCode,
  storeVerificationCode,
  hasActiveCode,
} from "@/lib/verification-db";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email, username } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Check if email is already registered
    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    // Check if username is already taken
    const { data: existingUsername } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .single();

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    // Check if there's already an active verification code
    if (await hasActiveCode(email)) {
      return NextResponse.json(
        {
          error:
            "A verification code was already sent. Please wait before requesting a new one.",
        },
        { status: 429 }
      );
    }

    const code = generateVerificationCode();
    const storeResult = await storeVerificationCode(email, code);

    if (!storeResult.success) {
      return NextResponse.json(
        { error: storeResult.error || "Failed to generate verification code" },
        { status: 500 }
      );
    }

    await transporter.sendMail({
      from: `"FlashBack" <${process.env.EMAIL}>`,
      to: email,
      subject: "Your FlashBack Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to FlashBack!</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; border-radius: 5px;">
            ${code}
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        </div>
      `,
      text: `Your FlashBack verification code is: ${code}. This code will expire in 10 minutes.`,
    });

    return NextResponse.json({
      message: "Verification code sent successfully",
      expiresIn: "10 minutes",
    });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
