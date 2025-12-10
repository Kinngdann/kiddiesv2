import { usePaystackPayment } from "react-paystack";
import { Button } from "@ui/button";

type PaystackProps = {
  contestantId: string;
  number_of_votes: number;
  isButtonDisabled: boolean;
};

export default function PaystackPaymentProcessing({
  // contestantId,
  number_of_votes,
  isButtonDisabled,
}: PaystackProps) {
  const COST_PER_VOTE = 50;
  const config = {
    reference: new Date().getTime().toString(),
    email: "user@example.com",
    amount: number_of_votes * (COST_PER_VOTE * 100),
    publicKey: "pk_test_d7686ff54ec8f09b78187e3e55422be1d2b61d01",
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: unknown) => {
    console.log("Payment success:", reference);
  };

  const onClose = () => {
    console.log("Payment closed");
  };

  return (
    <Button
      onClick={() => initializePayment({ onSuccess, onClose })}
      disabled={isButtonDisabled}>
      Continue
    </Button>
  );
}
