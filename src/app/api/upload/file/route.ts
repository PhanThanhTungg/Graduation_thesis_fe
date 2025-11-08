import { NextRequest, NextResponse } from "next/server";
import { uploadFileToBunny } from "@/utils/bunny-storage.util";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await uploadFileToBunny(file, "lesson-files");

    return NextResponse.json(
      {
        fileUrl: result.fileUrl,
        fileName: result.fileName,
        fileSize: result.fileSize,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload file",
      },
      { status: 500 }
    );
  }
}

