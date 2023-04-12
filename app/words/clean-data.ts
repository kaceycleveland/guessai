export const cleanWord = (word: string) => {
  // Get rid of punctuation
  // Get rid of whitespace
  const parsedWord = word.replaceAll(" ", "").replaceAll(".", "");
  if (parsedWord.length > 3 && parsedWord.length < 10) return parsedWord;
  return "";
};

export const cleanClues = (word: string, clues: string) => {
  const clueArray = clues
    .split("\n")
    .filter(Boolean)
    .map((clue) => {
      return clue.replace(/^[0-9]+./, "");
    })
    .filter((clue) => !clue.includes(word));
  return clueArray;
};
