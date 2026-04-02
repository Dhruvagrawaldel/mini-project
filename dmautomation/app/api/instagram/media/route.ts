import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

const MEDIA_FIELDS = "id,caption,media_type,media_url,thumbnail_url,timestamp,permalink,like_count,comments_count";

function formatMedia(items: any[]) {
  return items.map((item: any) => ({
    id:        item.id,
    caption:   item.caption || "",
    type:      item.media_type,
    url:       item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url,
    videoUrl:  item.media_type === "VIDEO" ? item.media_url : null,
    timestamp: item.timestamp,
    permalink: item.permalink,
    likes:     item.like_count ?? 0,
    comments:  item.comments_count ?? 0,
  }));
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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

    const { ig_access_token: token, ig_account_id: accountId } = user;

    // ── Strategy 1: Instagram Basic Display API ───────────────────────────────
    const igUrl = `https://graph.instagram.com/${accountId}/media?fields=${MEDIA_FIELDS}&access_token=${token}&limit=24`;
    const igRes  = await fetch(igUrl);
    const igData = await igRes.json();

    if (!igData.error) {
      return NextResponse.json({ connected: true, media: formatMedia(igData.data || []) });
    }

    // ── Strategy 2: Facebook Graph API (for Business tokens) ─────────────────
    const fbUrl = `https://graph.facebook.com/${accountId}/media?fields=${MEDIA_FIELDS}&access_token=${token}&limit=24`;
    const fbRes  = await fetch(fbUrl);
    const fbData = await fbRes.json();

    if (!fbData.error) {
      return NextResponse.json({ connected: true, media: formatMedia(fbData.data || []) });
    }

    // Both failed — return the error
    console.error("Instagram media fetch error:", igData.error);
    return NextResponse.json({ connected: true, error: igData.error.message, media: [] });
  } catch (err: any) {
    console.error("Instagram media route error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
