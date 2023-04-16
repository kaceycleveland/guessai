import { mutate } from "swr";

export const mutateArrayKey = (
  targetKey: (string | undefined)[] | string[]
) => {
  mutate((key?: string[]) => {
    if (key) {
      return targetKey.every((val, idx) => val === key[idx]);
    }
  });
};
