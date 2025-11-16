import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET (req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  try {
    const cookieStore = await cookies();
    const data = cookieStore.get(name);
    if (!data) {
      return new Response(JSON.stringify({ message: `Cookie with name ${name} not found.` }), { status: 404 });
    }
    return new Response(JSON.stringify( data.value ), { status: 200 });
  } catch (error) {
    console.error("Error retrieving cookie:", error);
    return new Response(JSON.stringify({ message: "Error retrieving cookie." }), { status: 500 });
  }
}

export async function POST (req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  try {
    const [requestData, cookieStore] = await Promise.all([
      req.json(),
      cookies()
    ]);
    console.log("Request data:", requestData.value);
    cookieStore.set({
      name,
      value: JSON.stringify(requestData.value),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })

    return new Response(JSON.stringify({ message: `Cookie with name ${name} set successfully.` }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ message: "Error setting cookie." }), { status: 500 });
  }
}