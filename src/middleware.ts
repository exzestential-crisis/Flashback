import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: req,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            req.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request: req,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;

  // Define protected paths - all routes under (app) group are protected
  const protectedPaths = [
    "/home",
    "/dashboard",
    "/profile",
    "/create",
    "/decks",
    "/discover",
    "/favourites",
    "/folders",
    "/help",
    "/notifications",
    "/settings",
    "/statistics",
  ];

  // Auth pages (public pages)
  const authPaths = ["/", "/login", "/register", "/signup", "/verification"];

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuth = authPaths.some((path) => pathname === path);

  console.log("=== MIDDLEWARE DEBUG ===");
  console.log("Path:", pathname);
  console.log("User exists:", !!user);
  console.log("User ID:", user?.id || "none");
  console.log("Is Protected Route:", isProtected);
  console.log("Is Auth Route:", isAuth);
  console.log("Should redirect to /home:", user && isAuth);
  console.log("Should redirect to /:", !user && isProtected);
  console.log("========================");

  // Redirect logged-in users away from auth pages to /home
  if (user && isAuth) {
    const redirectUrl = new URL("/home", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect logged-out users away from protected pages to login
  if (!user && isProtected) {
    const redirectUrl = new URL("/", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
