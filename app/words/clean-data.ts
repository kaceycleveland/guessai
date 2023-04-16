export const cleanWord = (word: string) => {
  // Get rid of punctuation
  // Get rid of whitespace
  const parsedWord = word.replaceAll(" ", "").replaceAll(".", "");
  if (parsedWord.length > 3 && parsedWord.length < 10)
    return parsedWord.toLowerCase();

  console.warn("word cleaning failed:", parsedWord);
  return "";
};

export const cleanClues = (word: string, clues: string) => {
  const clueArray = clues
    .split("\n")
    .filter(Boolean)
    .map((clue) => {
      return clue.replace(/^[0-9]+./, "").replace(/^\s*(-)\s*/, "");
    })
    .filter((clue) => !clue.toLowerCase().includes(word.toLowerCase()));
  return clueArray;
};
