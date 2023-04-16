export type CluesArray = {
  clue: string | null;
  sort_order: number;
  max_attempts: number;
}[];

export type OrderedClues = {
  guesses?: {
    guess: string;
    correct: boolean;
    given_clue_id: number;
  }[];
  given_clue_id?: number;
  clue: {
    clue: string | null;
    sort_order: number;
    max_attempts: number;
  };
}[];
