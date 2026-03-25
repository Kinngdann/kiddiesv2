import { compare } from "bcryptjs";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { sessionOptions, SessionData } from "../../../../../lib/session";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    // console.log(username, password);

    if (
      !username ||
      !password ||
      username !== process.env.ADMIN_USERNAME
    ) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!passwordHash) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const valid = await compare(password, passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.isAdmin = true;
    await session.save();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
