export const getPagination = (page = 0, size = 7) => {
  const limit = size;
  const from = page * limit;
  const to = from + size;

  return { from, to };
};
