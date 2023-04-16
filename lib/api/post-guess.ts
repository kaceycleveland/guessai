import axios from 'axios';

import { GuessWord } from '@/types/guess-word';

interface PostGameGuessResponse {
  correct: boolean;
  game_id?: string;
}

export const postGameGuessKey = ['game', 'guess', 'post'];

export const postGameGuess = async (_: string[], { arg }: { arg: GuessWord }) => {
  return axios.post<PostGameGuessResponse>('/game/guess', arg);
};
