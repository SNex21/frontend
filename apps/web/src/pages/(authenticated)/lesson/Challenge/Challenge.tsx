import { FC } from "react";
import { Challenge, ChallengeType } from "@/models/Session.ts";
import { GapFillChallenge } from "@/pages/(authenticated)/lesson/Challenge/challenges/GapFillChallenge.tsx";
import { GapFillLetterChallenge } from "@/pages/(authenticated)/lesson/Challenge/challenges/GapFillLetterChallenge.tsx";
import { MistakeChallenge } from "@/pages/(authenticated)/lesson/Challenge/challenges/MistakeChallenge.tsx";
import { AccentsChallenge } from "@/pages/(authenticated)/lesson/Challenge/challenges/AccentsChallenge.tsx";
import { ChallengeLayout } from "@/pages/(authenticated)/lesson/Challenge/layout/ChallengeLayout.tsx";
import { PunctuationChallenge } from "./challenges/PunctuationChallenge";

interface ChallengeScreenProps {
  challenge: Challenge;
  next: (challenge: Challenge, isCorrect: boolean) => Promise<void>;
  updateStats: (isCorrect: boolean) => void;
}
  
interface ChallengeState {
  submitted?: boolean;
  wrong?: boolean;
}

const ChallengeScreen: FC<ChallengeScreenProps> = ({ challenge, updateStats, next }) => {
  const Challenge = getChallenge(challenge.type);

  return (
    <ChallengeLayout>
      <Challenge challenge={challenge} updateStats={updateStats} next={next} />
    </ChallengeLayout>
  );
}

function getChallenge(type: ChallengeType) {
  switch (type) {
    case "gapFill":
      return GapFillChallenge;
    case "gapFillLetter":
      return GapFillLetterChallenge;
    case "mistake":
      return MistakeChallenge;
    case "accents":
      return AccentsChallenge;
    case "punctuationFill":
      return PunctuationChallenge;
    default:
      return GapFillChallenge;
  }
}

export { type ChallengeScreenProps, type ChallengeState, ChallengeScreen };
