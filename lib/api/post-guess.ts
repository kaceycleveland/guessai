import { GuessWord } from "@/types/guess-word";
import axios from "axios";

interface PostGameGuessResponse {
  correct: boolean;
  game_id?: string;
}

export const postGameGuessKey = ["game", "guess", "post"];

export const postGameGuess = async (
  _: string[],
  { arg }: { arg: GuessWord }
) => {
  return axios.post<PostGameGuessResponse>("/game/guess", arg);
};
