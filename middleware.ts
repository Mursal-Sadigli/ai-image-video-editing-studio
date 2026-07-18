import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// =========================================================
// İctimai route-lar (auth tələb etmir)
// =========================================================

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing(.*)",
  "/features(.*)",
  "/use-cases(.*)",
  "/blog(.*)",
  "/about",
  "/contact",
  "/changelog",
  "/legal(.*)",
  "/share/(.*)",
  "/api/webhooks/(.*)",
  "/api/inngest",
  "/api/video",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

// =========================================================
// Admin route-lar (yalnız admin rolu)
// =========================================================

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // İctimai route-ları burax
  if (isPublicRoute(req)) {
    return;
  }

  // Qorunan route-lar — auth tələb et
  const session = await auth.protect();

  // Admin route-ları üçün rol yoxlaması
  if (isAdminRoute(req)) {
    // Clerk session metadata-dan rol yoxlaması
    // Bu, Clerk dashboard-dan custom claim kimi qurulmalıdır
    const role = session.sessionClaims?.metadata?.role;
    if (role !== "admin") {
      return Response.redirect(new URL("/dashboard", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Next.js internal fayllarını və statik asset-ləri xaric et
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|webm|ogg|mov)).*)",
    "/(api|trpc)(.*)",
  ],
};
