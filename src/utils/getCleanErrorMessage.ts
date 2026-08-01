const getCleanErrorMessage = (message: string) => {
  const lines = message
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.at(-1) ?? message;
};

export default getCleanErrorMessage;
