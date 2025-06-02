import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyCode } from "@/lib/verification-db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received request body:", body); // Debug log

    const { username, email, password, code, user_type, interests } = body;

    console.log("Extracted fields:", {
      username,
      email,
      password: password ? "[HIDDEN]" : "MISSING",
      code,
      user_type,
      interests,
    });

    if (!username || !email || !password || !code || !user_type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the code using database approach
    const verification = await verifyCode(email, code);
    if (!verification.isValid) {
      return NextResponse.json({ error: verification.error }, { status: 400 });
    }

    // Create account in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        emailRedirectTo: undefined,
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user?.id) {
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

    // Prepare the profile data
    const profileData = {
      auth_id: authData.user.id,
      username: username, // Make sure this is the username, not email
      email: email.toLowerCase(),
      user_type: user_type,
      interests: interests || [],
      last_login: new Date().toISOString(),
    };

    // Create user profile
    const { data: insertedProfile, error: profileError } = await supabase
      .from("users")
      .upsert([profileData], { onConflict: "auth_id" })
      .select()
      .single();

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return NextResponse.json(
        { error: "Failed to create user profile: " + profileError.message },
        { status: 500 }
      );
    }

    console.log("Profile created successfully:", insertedProfile); // Debug log

    return NextResponse.json({
      message: "Account created successfully",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        profile: insertedProfile,
      },
      session: authData.session,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
