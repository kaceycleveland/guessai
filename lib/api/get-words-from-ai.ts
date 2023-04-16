import { GenerateWord } from "@/types/generate-word";
import axios from "axios";

export const getWordsFromAIKey = ["words", "post"];

export const getWordsFromAI = async (_: string[]) => {
  return axios.post<GenerateWord>("/words");
};
