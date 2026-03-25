export type VoteBundle = {
  label: string;
  votes: number;
  price: number; // naira
  highlight?: boolean;
};

export const VOTE_BUNDLES: VoteBundle[] = [
  { label: "Starter", votes: 10, price: 500 },
  { label: "Fan Pack", votes: 50, price: 2500, highlight: true },
  { label: "Champion", votes: 200, price: 10000 },
  { label: "Legend", votes: 1000, price: 50000 },
];
