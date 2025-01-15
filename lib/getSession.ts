import { cookies } from "next/headers";
import { cache } from "react";
import { decrypt } from "./sessions";

export const getSession = cache(async () => {
  // Retrieve the session cookie
  const sessionCookie = (await cookies()).get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  // Verify the session

  try {
    const session = await decrypt(sessionCookie);
    return session || null;
  } catch (error) {
    console.error("Failed to decode session:", error);
    return null;
  }
});
