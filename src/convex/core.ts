import { query } from "./_generated/server";

export const config = query({
  args: {},
  handler: () => {
    return _config();
  },
});

export const _config = () => {
  const BANNER_PERIOD_OVER = process.env.BANNER_PERIOD_OVER === "true";
  const MAX_QUESTION_LENGTH = parseInt(
    process.env.MAX_QUESTION_LENGTH ?? "200",
  );
  const TOP_LIST_LENGTH = parseInt(process.env.TOP_LIST_LENGTH ?? "5");

  return {
    BANNER_PERIOD_OVER, // boolean
    MAX_QUESTION_LENGTH, // characters
    TOP_LIST_LENGTH, // questions
  };
};
