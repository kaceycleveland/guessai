import axios from 'axios';

import { GenerateWord } from '@/types/generate-word';

export const getWordsFromAIKey = ['words', 'post'];

export const getWordsFromAI = async (_: string[]) => {
  return axios.post<GenerateWord>('/words');
};
