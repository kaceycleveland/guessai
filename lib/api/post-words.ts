import { GenerateWord } from "@/types/generate-word";
import axios from "axios";

export const postAssignment = async (
  _: string,
  { arg }: { arg: GenerateWord }
) => {
  console.log(arg);
  return axios.post<void, GenerateWord>("/words", arg);
};
