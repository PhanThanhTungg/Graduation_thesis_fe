import { NextRequest, NextResponse } from "next/server";
import { uploadVideoToBunny } from "@/utils/bunny.util";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("video/")) {
      return NextResponse.json({ error: "File must be a video" }, { status: 400 });
    }

    const result = await uploadVideoToBunny(file, title || undefined);

    return NextResponse.json(
      {
        videoId: result.videoId,
        embedUrl: result.embedUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload video",
      },
      { status: 500 }
    );
  }
}

