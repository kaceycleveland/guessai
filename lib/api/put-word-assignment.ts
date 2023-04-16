import { PutWordToDate } from "@/types/put-word-to-date";
import axios from "axios";

export const putWordAssignmentKey = ["word", "assignment", "put"];

export const putWordAssignment = async (
  _: any,
  { arg }: { arg: PutWordToDate }
) => {
  return axios.put<void, unknown, PutWordToDate>("/words/assignment", arg);
};
