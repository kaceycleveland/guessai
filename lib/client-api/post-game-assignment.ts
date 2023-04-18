import axios from 'axios';

interface postGameAssignment {
  message: string;
  code?: 1 | 0;
}

export const postGameAssignmentKey = ['game', 'assignment', 'post'];

export const postGameAssignment = async (_: string[]) => {
  return axios.post<postGameAssignment>('/game/assignment');
};
