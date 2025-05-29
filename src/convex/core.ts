import { query } from "./_generated/server";

export const config = query({
  args: {},
  handler: () => {
    return _config();
  },
});

export const _config = () => {
  const MAX_QUESTION_LENGTH = parseInt(
    process.env.MAX_QUESTION_LENGTH ?? "200",
  );

  return {
    MAX_QUESTION_LENGTH, // characters
  };
};
