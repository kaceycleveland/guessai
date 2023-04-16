import axios from 'axios';

interface PostGameClueResponse {
  message: string;
  game_id?: string;
}

export const postGameClueKey = ['game', 'clue', 'post'];

export const postGameClue = async (_: string[]) => {
  return axios.post<PostGameClueResponse>('/game/clue');
};
