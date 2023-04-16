import axios from 'axios';

import { GetWord } from '@/types/get-word';

export const getWordsKey = ['words', 'get'];

export const getWords = () => {
  return axios.get<{ words: GetWord[] }>('/words');
};
