import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { capitalize } from "@/utils/capitalize";
import { contestantImageSrc } from "@/utils/contestant-image";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.leadritehub.com";

interface ContestantOgImageParams {
  params: Promise<{ contestantId: string }>;
}

export default async function ContestantOgImage({
  params,
}: ContestantOgImageParams) {
  const { contestantId } = await params;
  const contestant = await prisma.contestant.findUnique({
    where: { contestantId, disabled: false },
    select: {
      contestantId: true,
      firstName: true,
      lastName: true,
      gender: true,
      picture: true,
    },
  });

  const name = contestant
    ? [contestant.firstName, contestant.lastName]
        .filter(Boolean)
        .map(capitalize)
        .join(" ")
    : `Contestant #${contestantId}`;
  const imageUrl = contestantImageSrc(
    contestant?.picture,
    contestant?.gender,
    APP_URL,
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#fff7cf",
          color: "#111111",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #fff7cf 0%, #ffffff 48%, #facc14 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 48,
            right: 56,
            bottom: 48,
            display: "flex",
            border: "6px solid #111111",
            background: "#ffffff",
            boxShadow: "18px 18px 0 #111111",
          }}>
          <div
            style={{
              width: 500,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#facc14",
              borderRight: "6px solid #111111",
              padding: 34,
            }}>
            <img
              src={imageUrl}
              alt=""
              width={390}
              height={470}
              style={{
                width: 390,
                height: 470,
                objectFit: "cover",
                border: "6px solid #111111",
                background: "#ffffff",
              }}
            />
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "54px 62px",
              gap: 24,
            }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}>
              <div
                style={{
                  display: "flex",
                  width: "fit-content",
                  background: "#111111",
                  color: "#facc14",
                  fontSize: 28,
                  fontWeight: 800,
                  padding: "12px 18px",
                }}>
                The Future Star Contest
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 68,
                  lineHeight: 0.98,
                  fontWeight: 900,
                }}>
                Help {name} win the contest
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 32,
                  lineHeight: 1.2,
                  fontWeight: 800,
                  color: "#555555",
                }}>
                Campaign for contestant #{contestantId}. Every vote counts.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                fontSize: 34,
                fontWeight: 800,
              }}>
              <span
                style={{
                  display: "flex",
                  background: "#facc14",
                  border: "4px solid #111111",
                  padding: "10px 18px",
                }}>
                Contestant #{contestantId}
              </span>
              <span style={{ display: "flex" }}>Vote today</span>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
