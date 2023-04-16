import { GetWord } from "@/types/get-word";
import axios from "axios";

export const getWordsKey = ["words", "get"];

export const getWords = () => {
  return axios.get<{ words: GetWord[] }>("/words");
};
