import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get the user's stored Instagram credentials
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("ig_access_token, ig_account_id")
      .eq("id", (session.user as any).id)
      .single();

    if (error || !user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.ig_access_token || !user.ig_account_id) {
      return NextResponse.json({ connected: false, media: [] });
    }

    // Fetch media from Instagram Graph API
    const fields = "id,caption,media_type,media_url,thumbnail_url,timestamp,permalink,like_count,comments_count";
    const igUrl = `https://graph.instagram.com/${user.ig_account_id}/media?fields=${fields}&access_token=${user.ig_access_token}&limit=24`;

    const igRes = await fetch(igUrl);
    const igData = await igRes.json();

    if (igData.error) {
      console.error("Instagram API error:", igData.error);
      return NextResponse.json(
        { connected: true, error: igData.error.message, media: [] },
        { status: 200 }
      );
    }

    const media = (igData.data || []).map((item: any) => ({
      id: item.id,
      caption: item.caption || "",
      type: item.media_type,
      url: item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url,
      videoUrl: item.media_type === "VIDEO" ? item.media_url : null,
      timestamp: item.timestamp,
      permalink: item.permalink,
      likes: item.like_count ?? 0,
      comments: item.comments_count ?? 0,
    }));

    return NextResponse.json({ connected: true, media });
  } catch (err: any) {
    console.error("Instagram media fetch error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
