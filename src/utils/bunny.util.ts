const LIB_ID = process.env.NEXT_BUNNY_STREAM_LIBRARY_ID;
const API_KEY = process.env.NEXT_BUNNY_STREAM_API_KEY;

export async function uploadVideoToBunny(file: File, title?: string): Promise<{ videoId: string; embedUrl: string }> {
  if (!LIB_ID || !API_KEY) {
    throw new Error("Bunny Stream not configured");
  }

  const videoTitle = title || file.name;

  const createRes = await fetch(`https://video.bunnycdn.com/library/${LIB_ID}/videos`, {
    method: "POST",
    headers: {
      "AccessKey": API_KEY,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: videoTitle }),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Create video failed: ${errorText}`);
  }

  const created = await createRes.json();
  const videoId = created.guid || created.videoId || created.id;

  const arrayBuffer = await file.arrayBuffer();

  const uploadRes = await fetch(
    `https://video.bunnycdn.com/library/${LIB_ID}/videos/${videoId}`,
    {
      method: "PUT",
      headers: {
        "AccessKey": API_KEY,
        "Accept": "application/json",
      },
      body: arrayBuffer,
    }
  );

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Upload failed: ${errorText}`);
  }

  const embedUrl = `https://iframe.mediadelivery.net/embed/${LIB_ID}/${videoId}`;

  return { videoId, embedUrl };
}
