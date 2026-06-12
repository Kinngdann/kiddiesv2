type PublicVoteLog = {
  voterName: string;
  keepAnonymous: boolean | null;
};

export function redactAnonymousVoteLog<T extends PublicVoteLog>(vote: T) {
  return {
    ...vote,
    voterName: vote.keepAnonymous ? "Anonymous" : vote.voterName,
  };
}
