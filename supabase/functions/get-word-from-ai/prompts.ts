import { ChatCompletionOptions } from 'https://deno.land/x/openai/mod.ts';

export const DEFAULT_REQUEST_SETTINGS: Omit<ChatCompletionOptions, 'messages'> = {
  model: 'gpt-3.5-turbo',
  presencePenalty: 1,
  frequencyPenalty: 0.5,
  maxTokens: 500,
};

export const GET_WORD_PROMPT = (wordList: string) => `
You are a word guessing game generator.
You can come up with unique words and clues to go with those words.
All of your words must be nouns.
The word must be appropriate for all ages.
The word must have a unique origin.
The word must not be any word in this list:
${wordList}

Give just a generated word with no clues to start.
Your word must be between 4 and 10 characters long.
You will only respond with the word by itself.
Your generated word is:
`;

export const GET_CLUES_PROMPT = (word: string) => `
Now generate 15 clues for someone guessing the word you gave me '${word}'.
Your clues must focus specifically on the origin of the word '${word}'.
Your clues must focus on describing the word '${word}'.
Your clues must start or end with the text "this word".
Your clues must not use any word that is similar or the same as '${word}'.
Your clues must not use the word '${word}' or any similar words it pertain to in the clues themselves.
Create your clues for the word '${word}' below:
`;

export const CLEAN_CLUES_PROMPT = (word: string) => `
Remove any numbering or bullet points prepended to your clues you outputted.
Separate each of your clues to be on new lines.
Remove any clues that include any words similar to the word '${word}'.
List out the formatted clues below:
`;
