import { type Choice, type DisplayToken } from "@/models/Session.ts";

import React from "react";

import sharedStyles from "./GapFillTokens.module.scss";
import styles from "./GapFillLetterTokens.module.scss";
import { ChoiceLetter } from "@/pages/(authenticated)/lesson/Challenge/shared/Choices/ChoicesLetter.tsx";
import { ChallengeState } from "@/pages/(authenticated)/lesson/Challenge/Challenge.tsx";

interface GapFillLetterTokensProps {
  challengeId: string;
  attempt?: number;
  displayTokens?: DisplayToken[];
  currentChoice?: Choice | null;
  isRight?: boolean;
  setChoice: React.Dispatch<React.SetStateAction<Choice | null>>;
  state?: ChallengeState;
}

const GapFillLetterTokens: React.FC<GapFillLetterTokensProps> = ({
  challengeId,
  attempt = 0,
  currentChoice,
  displayTokens,
  state,
  setChoice,
}) => {
  if (!displayTokens) {
    return null;
  }

  return (
    <div className={sharedStyles.wrapper}>
      <div className={sharedStyles.tokens}>
        {displayTokens.map((token, i) => {
          if (!token.isBlank) {
            return <span key={i}>{token.text}</span>;
          }

          if (currentChoice) {
            return (
              <span key={i} className={styles.line}>
                <ChoiceLetter
                  challengeId={challengeId}
                  text={currentChoice.text}
                  onSelect={state?.submitted ? undefined : () => setChoice(null)}
                  state={state}
                  attempt={attempt}
                />
              </span>
            );
          }

          return <span key={i} className={styles.line} />;
        })}
      </div>
    </div>
  );
};

export { GapFillLetterTokens };
