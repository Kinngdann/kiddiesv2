import { usePaystackPayment } from "react-paystack";
import { Button } from "@ui/button";
import { toast } from "sonner";
import { useState } from "react";

type VoteData = {
  voterName: string;
  numberOfVotes: string;
  keepAnonymous: boolean | null;
};

type PaymentData = {
  contestantId: string;
  voteData: VoteData;
};

type PaystackProps = {
  updateSuccessDialogData: (numberOfVotes: string) => void;
  isFormValid: boolean;
  closeAllDialog: () => void;
  paymentData: PaymentData;
};

export default function PaystackPaymentProcessing({
  updateSuccessDialogData,
  isFormValid,
  closeAllDialog,
  paymentData,
}: PaystackProps) {
  const [paymentConfig, setPaymentConfig] = useState({
    reference: "",
    email: "",
    amount: 0,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
  });
  const [initializing, setInitializing] = useState(false);

  const initializePayment = usePaystackPayment(paymentConfig);

  const onSuccess = async (transaction: { reference: string }) => {
    const voteData = {
      contestantId: paymentData.contestantId,
      voterName: paymentData.voteData.voterName,
      voteMethod: "paystack",
      reference: transaction.reference,
      ...(paymentData.voteData.keepAnonymous !== null && {
        keepAnonymous: paymentData.voteData.keepAnonymous,
      }),
    };

    const response = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voteData),
    });

    if (response.ok) {
      updateSuccessDialogData(paymentData.voteData.numberOfVotes);
    } else {
      const err = await response.json().catch(() => ({}));
      toast.error(err.error ?? "Vote could not be recorded. Contact support.");
    }
  };

  const onClose = () => {
    // Payment modal closed without completing
  };

  const onSubmit = async () => {
    if (!isFormValid || initializing) return;

    setInitializing(true);
    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contestantId: paymentData.contestantId,
          voterName: paymentData.voteData.voterName,
          numberOfVotes: Number(paymentData.voteData.numberOfVotes),
          keepAnonymous: paymentData.voteData.keepAnonymous === true,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        toast.error(err.error ?? "Could not initialize payment.");
        return;
      }

      const nextConfig = await response.json();
      setPaymentConfig(nextConfig);
      closeAllDialog();
      initializePayment({
        config: nextConfig,
        onSuccess,
        onClose,
      });
    } catch {
      toast.error("Could not initialize payment.");
    } finally {
      setInitializing(false);
    }
  };

  return (
    <Button onClick={onSubmit} type="submit" disabled={initializing}>
      {initializing ? "Initializing..." : "Continue"}
    </Button>
  );
}
