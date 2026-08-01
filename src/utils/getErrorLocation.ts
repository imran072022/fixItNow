export const getErrorLocation = (stack: string): string | undefined => {
  const match = stack.match(/src[\\/].+?\.(ts|js):\d+:\d+/);

  return match?.[0].replaceAll("\\", "/");
};
