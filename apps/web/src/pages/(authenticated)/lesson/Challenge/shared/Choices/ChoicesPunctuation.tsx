import React from "react";
import { Choice } from "@/models/Session.ts";
import { ChallengeState } from "@/pages/(authenticated)/lesson/Challenge/Challenge.tsx";
import styles from "./ChoicesPunctuation.module.scss";
import cn from "classnames";
import { Haptic } from "@/lib/twa/components/Haptic.tsx";

interface ManyChoicesPunctuationProps {
  choices?: Choice[];
  state?: ChallengeState;
  correctAnswerIds?: number[] | null; // Массив правильных ответов
  selectedIndexes: Set<number>; // Множество выбранных индексов
  toggleChoice: (index: number) => void; // Функция для изменения выбора
}

interface ChoicePunctuationProps {
  choice?: Choice;
  onSelect?: () => void;
  isSelected?: boolean;
  state?: ChallengeState;
  isCorrect?: boolean; // Новое свойство
}

const ChoicesPunctuation: React.FC<ManyChoicesPunctuationProps> = ({
  choices,
  state,
  correctAnswerIds,
  selectedIndexes,
  toggleChoice
}) => {
  if (!choices) {
    return null;
  }

  return (
    <div className={styles.choices}>
      {choices.map((choice, i) => {
        // Проверяем, является ли ячейка пробелом (место для запятой)
        const isSpace = choice?.text === " ";
        // Проверяем, является ли ячейка правильной (если она в массиве правильных ответов)
        const isCorrect = correctAnswerIds?.includes(i) || false;

        return (
          <ChoicePunctuation
            key={`${choice.text}-${i}`}
            choice={choice}
            onSelect={isSpace && !state?.submitted ? () => toggleChoice(i) : undefined}
            isSelected={selectedIndexes.has(i)}
            state={state}
            isCorrect={isCorrect} // Передаем флаг правильности
          />
        );
      })}
    </div>
  );
};

const ChoicePunctuation: React.FC<ChoicePunctuationProps> = ({
  choice,
  onSelect,
  state,
  isSelected,
  isCorrect
}) => {
  // Проверяем, является ли ячейка пробелом (место для запятой)
  const isSpace = choice?.text === " ";

  return (
    <Haptic type={"impact"} value={"medium"} disabled={!isSpace || state?.submitted} asChild>
      <div
        className={cn(styles.choice, {
          [styles["choice_not-submitted"]!]: !state?.submitted,
          [styles.choice_selected!]: isSelected,
          [styles.choice_right!]: isCorrect, // Зелёное выделение для правильного места для запятой
          [styles.choice_wrong!]: isSelected && state?.submitted && !state?.wrong,
          [styles.choice_disabled!]: !isSpace,
        })}
        role="radio"
        onClick={onSelect}
        aria-disabled={!isSpace}
      >
        <span className={styles.choice__text}>
          {choice?.text === " " ? " " : choice?.text}
        </span>
        {isCorrect && (
          <div className={styles.choice__accent}>
            <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 0L3.05825 11H0L2.32767 0H7Z" />
            </svg>
          </div>
        )}
        {isSelected && (
          <div className={styles.choice__accent}>
            <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 0L3.05825 11H0L2.32767 0H7Z" />
            </svg>
          </div>
        )}
      </div>
    </Haptic>
  );
};

export { ChoicesPunctuation };
