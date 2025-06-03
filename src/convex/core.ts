import { query } from "./_generated/server";

export const config = query({
  args: {},
  handler: () => {
    return _config();
  },
});

export const _config = () => {
  const BASE_PRICE = parseInt(process.env.BASE_PRICE ?? "1490");
  const BANNER_PERIOD_OVER = process.env.BANNER_PERIOD_OVER === "true";
  const MAX_QUESTION_LENGTH = parseInt(
    process.env.MAX_QUESTION_LENGTH ?? "200",
  );
  const TOP_LIST_LENGTH = parseInt(process.env.TOP_LIST_LENGTH ?? "5");

  return {
    BASE_PRICE,
    BANNER_PERIOD_OVER, // boolean
    MAX_QUESTION_LENGTH, // characters
    TOP_LIST_LENGTH, // questions
  };
};
