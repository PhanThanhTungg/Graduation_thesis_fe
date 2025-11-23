"use server";

import { cookies } from "next/headers";

export async function setCookieAction(name: string, value: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set({
      name,
      value,
      httpOnly: false,
      path: "/",
      sameSite: "lax",
    });
    console.log(`Cookie with name ${name} set successfully.`);
  } catch (error) {
    console.error("Error setting cookie:", error);
  }
}
