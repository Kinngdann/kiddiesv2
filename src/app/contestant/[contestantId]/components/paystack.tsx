import { usePaystackPayment } from "react-paystack";
import { Button } from "@ui/button";
// import { Lock } from "lucide-react";

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
  // console.log("key", process.env.PAYSTACK_PUBLIC_KEY);
  const ref = new Date().getTime().toString();

  const config = {
    reference: ref,
    email: `${paymentData.contestantId}-${ref}@kidscrown.net`,
    amount: Number(paymentData.voteData.numberOfVotes) * (COST_PER_VOTE * 100),
    publicKey: "pk_live_eae4d935752ac44cb106cc9ff96e7519b17c9660",
    // publicKey: process.env.PAYSTACK_PUBLIC_KEY || "",
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async () => {
    let voteData;
    voteData = {
      contestantId: paymentData.contestantId,
      voterName: paymentData.voteData.voterName,
      amount: Number(paymentData.voteData.numberOfVotes) * COST_PER_VOTE,
      voteMethod: "paystack",
      // keepAnonymous: paymentData.voteData.keepAnonymous,
    };

    if (paymentData.voteData.keepAnonymous !== null) {
      voteData = {
        ...voteData,
        keepAnonymous: paymentData.voteData.keepAnonymous,
      };
    }

    await fetch("http://localhost:3000/api/vote", {
      method: "POST",
      body: JSON.stringify(voteData),
    });

    console.log("Payment successful");
    updateSuccessDialogData(paymentData.voteData.numberOfVotes);
  };

  const onClose = () => {
    console.log("Payment closed");
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
