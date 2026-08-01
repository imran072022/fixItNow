export const getCleanMessage = (message: string) => {
  const cleaned = message
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .at(-1);

  return cleaned ?? message;
};
