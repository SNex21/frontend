export interface Session {
  id: string;
  isHard?: boolean;
  isWorkOnMistakes?: boolean;
  topic?: number;
  challenges: Challenge[];
  amount: number;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  prompt?: string;
  displayTokens?: DisplayToken[];
  choices?: Choice[];
  isHard?: boolean;
  isWorkOnMistakes?: boolean;
  explanation?: string;

  isLocalWom?: boolean;
  attempt?: number;
}

export type ChallengeType = "gapFill" | "accents" | "mistake" | "gapFillLetter" | "punctuationFill";

export interface Choice {
  text: string;
  isCorrect: boolean;
}
export interface DisplayToken {
  text: string;
  isBlank: boolean;
}

export interface Guess {
  challengeId: string;
  correct: boolean;
}

[]
