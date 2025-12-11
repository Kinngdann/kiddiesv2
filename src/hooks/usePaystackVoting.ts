import { usePaystackPayment } from "react-paystack";

interface PaystackVoteConfig {
  email: string;
  amount: number; // in kobo
  publicKey: string;
}

export function usePaystackVoting(config: PaystackVoteConfig) {

  const initializePayment = usePaystackPayment({
    reference: Date.now().toString(),
    email: config.email,
    amount: config.amount,
    publicKey: config.publicKey,
  });

  const startPayment = (onSuccess: () => void, onClose: () => void) => {
    initializePayment({ onSuccess, onClose });
  };

  return startPayment;
}
