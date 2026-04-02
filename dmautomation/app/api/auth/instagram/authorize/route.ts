import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * GET /api/auth/instagram/authorize
 * Redirects the logged-in user to Instagram's OAuth consent screen.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL!));
  }

  const appId = process.env.INSTAGRAM_APP_ID;
  const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/auth/instagram/callback`;

  if (!appId) {
    return NextResponse.json(
      { message: "INSTAGRAM_APP_ID is not set in environment variables." },
      { status: 500 }
    );
  }

  // Instagram Basic Display API OAuth URL
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope: "user_profile,user_media",
    response_type: "code",
  });

  const authUrl = `https://api.instagram.com/oauth/authorize?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}
