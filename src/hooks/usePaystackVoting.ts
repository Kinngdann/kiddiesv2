import { useId } from "react";
import { usePaystackPayment } from "react-paystack";

interface PaystackVoteConfig {
  email: string;
  amount: number; // in kobo
  publicKey: string;
}

export function usePaystackVoting(config: PaystackVoteConfig) {
  const reference = useId().replaceAll(":", "");

  const initializePayment = usePaystackPayment({
    reference,
    email: config.email,
    amount: config.amount,
    publicKey: config.publicKey,
  });

  const startPayment = (onSuccess: () => void, onClose: () => void) => {
    initializePayment({ onSuccess, onClose });
  };

  return startPayment;
}
