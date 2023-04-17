import { ChatCompletionOptions } from 'https://deno.land/x/openai/mod.ts';

export const DEFAULT_REQUEST_SETTINGS: Omit<ChatCompletionOptions, 'messages'> = {
  model: 'gpt-3.5-turbo',
  presencePenalty: 1,
  frequencyPenalty: 0.5,
  maxTokens: 500,
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