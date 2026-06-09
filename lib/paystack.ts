type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data: {
    status: string;
    amount: number;
    reference: string;
    customer?: {
      email?: string;
    };
  };
};

export async function verifyPaystackTransaction(
  reference: string
): Promise<PaystackVerifyResponse> {
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Paystack verify request failed: ${res.status}`);
  }

  return res.json();
}
