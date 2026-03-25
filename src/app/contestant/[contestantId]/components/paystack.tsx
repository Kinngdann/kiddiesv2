import { usePaystackPayment } from "react-paystack";
import { Button } from "@ui/button";
import { toast } from "sonner";

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

const COST_PER_VOTE = 50;

export default function PaystackPaymentProcessing({
  updateSuccessDialogData,
  isFormValid,
  closeAllDialog,
  paymentData,
}: PaystackProps) {
  const ref = new Date().getTime().toString();

  const config = {
    reference: ref,
    email: `${paymentData.contestantId}-${ref}@kidscrown.net`,
    amount: Number(paymentData.voteData.numberOfVotes) * (COST_PER_VOTE * 100),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
  };

  const initializePayment = usePaystackPayment(config);

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

  const onSubmit = () => {
    if (isFormValid) {
      closeAllDialog();
      initializePayment({ onSuccess, onClose });
    }
  };

  return (
    <Button onClick={onSubmit} type="submit">
      Continue
    </Button>
  );
}
