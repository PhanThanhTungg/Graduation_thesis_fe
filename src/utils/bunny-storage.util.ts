const STORAGE_ZONE = process.env.NEXT_BUNNY_STORAGE_ZONE;
const STORAGE_API_KEY = process.env.NEXT_BUNNY_STORAGE_API_KEY;
const STORAGE_CDN_URL = process.env.NEXT_BUNNY_STORAGE_CDN_URL;

export async function uploadFileToBunny(
  file: File,
  path?: string
): Promise<{ fileUrl: string; fileName: string; fileSize: number }> {
  if (!STORAGE_ZONE || !STORAGE_API_KEY) {
    throw new Error("Bunny Storage not configured");
  }

  const fileName = file.name;
  const filePath = path ? `${path}/${fileName}` : fileName;
  const fileSize = file.size;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadUrl = `https://storage.bunnycdn.com/${STORAGE_ZONE}/${filePath}`;

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      AccessKey: STORAGE_API_KEY,
      "Content-Type": file.type || "application/octet-stream",
    },
    body: buffer,
  });

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Upload failed: ${errorText}`);
  }

  const fileUrl = STORAGE_CDN_URL
    ? `https://${STORAGE_CDN_URL}.b-cdn.net/${filePath}`
    : `https://${STORAGE_ZONE}.b-cdn.net/${filePath}`;

  return { fileUrl, fileName, fileSize };
}

