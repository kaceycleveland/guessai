import axios from 'axios';

import { PutWordToDate } from '@/types/put-word-to-date';

export const putWordAssignmentKey = ['word', 'assignment', 'put'];

export const putWordAssignment = async (_: any, { arg }: { arg: PutWordToDate }) => {
  return axios.put<void, unknown, PutWordToDate>('/words/assignment', arg);
};
