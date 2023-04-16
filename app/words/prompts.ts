import { CreateChatCompletionRequest } from "openai";

export const DEFAULT_REQUEST_SETTINGS: Omit<
  CreateChatCompletionRequest,
  "messages"
> = {
  model: "gpt-3.5-turbo",
  presence_penalty: 1,
  frequency_penalty: 0.5,
  max_tokens: 500,
};

export const GET_WORD_PROMPT = `
Give me a word that is a noun.
The word must be between 4 and 10 letters.
The word must be appropriate for all ages.
The word must have a unique origin.
`;

export const GET_CLUES_PROMPT = `
Generate 15 clues for someone guessing that word.
Each clue must focus specifically on the origin of the word.
Order the clues in order of difficulty.
Do not number the clues and separate each clue by a new line.
Write the clues out with the given requirements below:
`;

export const CLEAN_CLUES_PROMPT = `
Order the clues in order of guessing difficulty.
Remove any numbering or bullet points prepended to the clues.
Only give the clues by themselves.
Remove any clues that include any words similar to the word.
Have each clue be a max of two sentences long.
Write the clues out with the given requirements below:
`;

export const GET_CLUE_DETAILS_PROMPT = `
Explain how each clue is relevant to the word in detail.
You are allowed to use the word in your explanations.
Include each clue with its explanation.
Separate each clue and explanation by a new line.
`;
