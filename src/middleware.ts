import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/pathways",
  "/learning",
  "/wallet",
  "/portfolio",
  "/cv",
  "/credentials",
  "/transcript",
  "/support",
  "/rpl",
  "/applications",
  "/settings",
  "/onboarding",
  "/employer",
  "/provider",
  "/advisor",
  "/admin",
];

// Routes only for unauthenticated users
const authRoutes = ["/login", "/signup", "/forgot-password"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Check if route is protected
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if route is auth-only (login/signup)
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Redirect unauthenticated users from protected routes to login
  if (isProtected && !session) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Role-based route protection
  if (session && isProtected) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, onboarding_completed")
        .eq("user_id", session.user.id)
        .single();

      if (profile) {
        // Redirect to onboarding if not completed (except onboarding page itself)
        if (!profile.onboarding_completed && pathname !== "/onboarding") {
          return NextResponse.redirect(new URL("/onboarding", req.url));
        }

        // Role-based route guards
        if (pathname.startsWith("/admin") && profile.role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        if (pathname.startsWith("/employer") && !["employer", "admin"].includes(profile.role)) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        if (pathname.startsWith("/provider") && !["provider", "admin"].includes(profile.role)) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        if (pathname.startsWith("/advisor") && !["mentor", "assessor", "admin"].includes(profile.role)) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }
    } catch {
      // Profile fetch failed — allow through, handle in page
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|api/webhook).*)",
  ],
};
