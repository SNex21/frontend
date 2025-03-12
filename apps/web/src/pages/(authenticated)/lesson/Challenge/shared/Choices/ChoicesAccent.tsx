import React from "react";
import { Choice } from "@/models/Session.ts";
import { ChallengeState } from "@/pages/(authenticated)/lesson/Challenge/Challenge.tsx";
import styles from "./ChoicesAccent.module.scss";
import cn from "classnames";
import { Haptic } from "@/lib/twa/components/Haptic.tsx";

interface ManyChoicesAccentProps {
  choices?: Choice[];
  currentChoice: Choice | null;
  setChoice: React.Dispatch<React.SetStateAction<Choice | null>>;
  state?: ChallengeState;
  correctAnswerId?: Number | null; // Новое свойство
}

interface ChoiceAccentProps {
  choice?: Choice;
  onSelect?: () => void;
  isSelected?: boolean;
  state?: ChallengeState;
  isCorrect?: boolean; // Новое свойство
}

const ChoicesAccent: React.FC<ManyChoicesAccentProps> = ({ choices, currentChoice, setChoice, state, correctAnswerId }) => {
  if (!choices) {
    return null;
  }

  // Массив гласных букв
  const vowels = ["а", "е", "ё", "и", "о", "у", "ы", "э", "ю", "я"];

  return (
    <div className={styles.choices}>
      {choices.map((choice, i) => {
        // Проверяем, является ли буква гласной
        const isVowel = choice?.text && vowels.includes(choice.text.toLowerCase());
        // Проверяем, является ли буква правильной
        const isCorrect = correctAnswerId === i;

        return (
          <ChoiceAccent
            key={`${choice.text}-${i}`}
            choice={choice}
            onSelect={isVowel && !state?.submitted ? () => setChoice(choice) : undefined}
            isSelected={choice === currentChoice}
            state={state}
            isCorrect={isCorrect} // Передаем флаг правильности
          />
        );
      })}
    </div>
  );
};

const ChoiceAccent: React.FC<ChoiceAccentProps> = ({ choice, onSelect, state, isSelected, isCorrect }) => {
  // Массив гласных букв
  const vowels = ["а", "е", "ё", "и", "о", "у", "ы", "э", "ю", "я"];
  const isVowel = choice?.text && vowels.includes(choice.text.toLowerCase());

  return (
    <Haptic type={"impact"} value={"medium"} disabled={!isVowel || state?.submitted} asChild>
      <div
        className={cn(styles.choice, {
          [styles["choice_not-submitted"]!]: !state?.submitted,
          [styles.choice_selected!]: isSelected,
          [styles.choice_right!]: isCorrect, // Зелёное выделение для правильной буквы
          [styles.choice_wrong!]: isSelected && state?.submitted && !state?.wrong,
          [styles.choice_disabled!]: !isVowel,
        })}
        role="radio"
        onClick={onSelect}
        aria-disabled={!isVowel}
      >
        <span className={styles.choice__text}>
          {choice?.text}
        </span>
        {isCorrect && (
          <div className={styles.choice__accent}>
            <svg width="7" height="11" viewBox="0 0 7 11" fill="none"  xmlns="http://www.w3.org/2000/svg">
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
export { ChoicesAccent };
