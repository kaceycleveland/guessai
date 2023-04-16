import axios from "axios";

interface DateRangeQueryParams {
  before: string;
  after: string;
}

interface GetWordAssignmentsResponse {
  dates: Record<string, string[]>;
}

export const getWordAssignmentsKey = (params?: DateRangeQueryParams) =>
  ["words", "assignment", "get", params?.after, params?.before].filter(Boolean);

export const getWordAssignments = async (keys: string[]) => {
  return axios.get<GetWordAssignmentsResponse>("/words/assignment", {
    params: { before: keys[4], after: keys[3] },
  });
};
