import React from "react";
import { Choice } from "@/models/Session.ts";
import { ChallengeState } from "@/pages/(authenticated)/lesson/Challenge/Challenge.tsx";
import styles from "./ChoicesPunctuation.module.scss";
import cn from "classnames";

interface ChoicesPunctuationProps {
  choices?: Choice[];
  state?: ChallengeState;
  correctAnswerIds?: number[] | null;
  selectedIndexes: Set<number>;
  toggleChoice: (index: number) => void;
}

const ChoicesPunctuation: React.FC<ChoicesPunctuationProps> = ({
  choices,
  state,
  correctAnswerIds,
  selectedIndexes,
  toggleChoice,
}) => {
  if (!choices) return null;

  return (
    <div className={styles.choices}>
      {choices.map((choice, i) => {
        const isSpace = choice?.text === " ";
        const isCorrect = correctAnswerIds?.includes(i) || false;
        const isSelected = selectedIndexes.has(i);

        const className = cn(styles.choice, {
          [styles.choice_not_submitted]: !state?.submitted,
          [styles.choice_selected]: isSelected,
          [styles.choice_right]: isCorrect && state?.submitted,
          [styles.choice_wrong]: isSelected && state?.submitted && !isCorrect,
          [styles.choice_disabled]: !isSpace,
        });

        return (
          <span
            key={i}
            className={className}
            onClick={isSpace && !state?.submitted ? () => toggleChoice(i) : undefined}
            role="radio"
          >
            {isSpace ? " " : choice?.text}
          </span>
        );
      })}
    </div>
  );
};

export { ChoicesPunctuation };
