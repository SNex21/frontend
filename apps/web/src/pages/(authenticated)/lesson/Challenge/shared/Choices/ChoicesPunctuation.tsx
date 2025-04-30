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
          "choice_not-submitted": !state?.submitted,
          "choice_selected": isSelected,
          "choice_right": isCorrect && state?.submitted,
          "choice_wrong": isSelected && state?.submitted && !isCorrect,
          "choice_disabled": !isSpace,
        })
        

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
