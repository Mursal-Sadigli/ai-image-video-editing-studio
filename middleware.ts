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



export default clerkMiddleware(async (auth, req) => {
  // İctimai route-ları burax
  if (isPublicRoute(req)) {
    return;
  }

  // Qorunan route-lar — auth tələb et
  const session = await auth.protect();


});

export const config = {
  matcher: [
    // Next.js internal fayllarını və statik asset-ləri xaric et
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|webm|ogg|mov)).*)",
    "/(api|trpc)(.*)",
  ],
};
