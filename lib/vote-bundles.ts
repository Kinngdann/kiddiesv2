export type VoteBundle = {
  label: string;
  votes: number;
  price: number; // naira
  highlight?: boolean;
};

export const VOTE_BUNDLES: VoteBundle[] = [
  { label: "Starter", votes: 20, price: 1000 },
  { label: "Fan Pack", votes: 50, price: 2500 },
  { label: "Popular", votes: 100, price: 5000, highlight: true },
  { label: "Champion", votes: 200, price: 10000 },
];
