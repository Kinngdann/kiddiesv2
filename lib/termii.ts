/** Normalise a Nigerian number to Termii's required format: 2348XXXXXXXXX (no +) */
function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return "234" + digits.slice(1);
  return digits;
}

export async function sendWhatsApp(
  to: string,
  message: string
): Promise<void> {
  const apiKey = process.env.TERMII_API_KEY;
  const senderId = process.env.TERMII_SENDER_ID ?? "KiddiesCrown";

  if (!apiKey || apiKey === "your_termii_api_key_here") {
    console.warn("[Termii] TERMII_API_KEY not configured — skipping notification");
    return;
  }

  const body = {
    api_key: apiKey,
    to: normalisePhone(to),
    from: senderId,
    sms: message,
    type: "unicode",
    channel: "whatsapp",
  };

  const res = await fetch("https://v3.api.termii.com/api/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[Termii] Failed to send WhatsApp to ${to}: ${text}`);
  }
}
