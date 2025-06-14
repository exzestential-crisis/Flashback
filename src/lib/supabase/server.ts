// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Creates an authenticated Supabase server client
 * @returns Promise<SupabaseClient> - Authenticated Supabase client
 */
export async function createAuthenticatedSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Gets the authenticated user and their actual user_id from the database
 * @param supabase - Supabase client instance
 * @returns Promise<{user, actualUserId, error}> - User data or error
 */
export async function getAuthenticatedUser(supabase: any) {
  try {
    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth error:", authError);
      return {
        user: null,
        actualUserId: null,
        error: { message: "Unauthorized - Please log in", status: 401 },
      };
    }

    console.log("Authenticated user ID (auth):", user.id);

    // Get the actual user_id from your users table using the auth_id
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("user_id")
      .eq("auth_id", user.id)
      .single();

    if (userError || !userData) {
      console.error("User lookup error:", userError);
      return {
        user: null,
        actualUserId: null,
        error: { message: "User not found in database", status: 404 },
      };
    }

    const actualUserId = userData.user_id;
    console.log("Actual user ID from users table:", actualUserId);

    return {
      user,
      actualUserId,
      error: null,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      user: null,
      actualUserId: null,
      error: { message: "Authentication error", status: 500 },
    };
  }
}

/**
 * Higher-order function that handles authentication for API routes
 * @param handler - The actual API route handler function
 * @returns Wrapped handler with authentication
 */
export function withAuth(
  handler: (
    request: NextRequest,
    supabase: any,
    user: any,
    actualUserId: string
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      const supabase = await createAuthenticatedSupabaseClient();
      const { user, actualUserId, error } = await getAuthenticatedUser(
        supabase
      );

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status }
        );
      }

      return await handler(request, supabase, user, actualUserId);
    } catch (error) {
      console.error("Auth wrapper error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
