import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, type SessionData } from "./session";

export async function isAdminSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );

  return session.isAdmin === true;
}
