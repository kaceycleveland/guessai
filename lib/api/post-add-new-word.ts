import { GenerateWord } from "@/types/generate-word";
import axios from "axios";
import { getWordsKey } from "./get-words";
import { mutateArrayKey } from "../utils/mutate-array-key";
import { getWordAssignmentsKey } from "./get-word-assignments";

export const postAddNewWordKey = ["assignment", "post"];

export const postAddNewWord = async (
  _: string[],
  { arg }: { arg: GenerateWord }
) => {
  return axios.post<void, GenerateWord>("/assignment", arg).then(() => {
    mutateArrayKey(getWordsKey);
    mutateArrayKey(getWordAssignmentsKey());
  });
};
