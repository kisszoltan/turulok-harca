export type PhaseType = "upload" | "voting" | "complete";

export const challengeTypeValues = [
  "spark",
  "boost",
  "pro",
  "invalid",
] as const;
export type ChallengeTypeType = (typeof challengeTypeValues)[number];

export const submissionStatusValues = [
  "in progress",
  "error",
  "ready",
] as const;

export type SubmissionStatusType = (typeof submissionStatusValues)[number];
