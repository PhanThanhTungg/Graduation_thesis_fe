export async function getCookie(name: string): Promise<string | undefined> {
  if (typeof window === "undefined") {
    try {
      // Dynamic import để tránh lỗi khi build client-side
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      return cookieStore.get(name)?.value;
    } catch {
      return undefined;
    }
  }

  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return value;
}
