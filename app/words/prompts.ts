export const GET_WORD_PROMPT = `
Give me a word that is a noun.
The word must be between 4 and 10 letters.
The word must be appropriate for all ages.
The word must have a unique origin.
`;

export const GET_CLUES_PROMPT = `
Generate 10 clues for someone guessing that word.
Each clue must focus specifically on the origin of the word.
Do not give clues describing the meaning of the word.
Order the clues in order of difficulty.
Do not number the clues and separate each clue by a new line.
Do not use the word in any of the clues.
Do not use any words similar to the word in any of the clues.
Have each clue be a max of 1 sentence long.
`;

export const GET_CLUE_DETAILS_PROMPT = `
Explain how each clue is relevant to the word in detail.
You are allowed to use the word in your explanations.
Include each clue with its explanation.
Separate each clue and explanation by a new line.
`;
