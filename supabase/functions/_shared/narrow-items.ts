//{ [index: string]: T | T[] | null } |
export const narrowItems = <T extends Object>(item: T | T[] | null): T[] => {
  if (!item) return [];
  if (Array.isArray(item)) {
    return item.map((item) => item);
  }

  return [item];
};
