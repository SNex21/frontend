// ChoicesPunctuation.tsx

import React from "react";
import { Choice } from "@/models/Session.ts";
import { ChallengeState } from "@/pages/(authenticated)/lesson/Challenge/Challenge.tsx";
import styles from "./ChoicesPunctuation.module.scss";
import cn from "classnames";

interface ManyChoicesPunctuationProps {
  choices?: Choice[];
  state?: ChallengeState;
  correctAnswerIds?: number[] | null;
  selectedIndexes: Set<number>;
  toggleChoice: (index: number) => void;
}

interface ChoicePunctuationProps {
  choice?: Choice;
  onSelect?: () => void;
  isSelected?: boolean;
  state?: ChallengeState;
  isCorrect?: boolean;
}

const ChoicesPunctuation: React.FC<ManyChoicesPunctuationProps> = ({
  choices,
  state,
  correctAnswerIds,
  selectedIndexes,
  toggleChoice,
}) => {
  if (!choices) return null;

  return (
    <div className={styles.line}>
      {choices.map((choice, i) => {
        const isSpace = choice?.text === " ";
        const isCorrect = correctAnswerIds?.includes(i) || false;

        return (
          <ChoicePunctuation
            key={`${choice.text}-${i}`}
            choice={choice}
            onSelect={isSpace && !state?.submitted ? () => toggleChoice(i) : undefined}
            isSelected={selectedIndexes.has(i)}
            state={state}
            isCorrect={isCorrect}
          />
        );
      })}
    </div>
  );
};

const ChoicePunctuation: React.FC<ChoicePunctuationProps> = ({
  choice,
  onSelect,
  isSelected,
  state,
  isCorrect,
}) => {
  const isSpace = choice?.text === " ";

  if (!choice) return null;

  if (isSpace) {
    return (
      <span
      className={cn(styles.punctuationSlot, {
        [styles.selected as string]: isSelected,
        [styles.correct as string]: isCorrect && state?.submitted,
        [styles.wrong as string]: isSelected && state?.submitted && !isCorrect,
      })}
      
      >
        {isSelected ? "," : ""}
      </span>
    );
  }

  return <span className={styles.word}>{choice.text}</span>;
};

export { ChoicesPunctuation };
