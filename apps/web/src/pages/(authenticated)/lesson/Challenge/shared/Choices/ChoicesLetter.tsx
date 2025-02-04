import { Choice } from "@/models/Session.ts";
import React from "react";
import cn from "classnames";

import styles from "./ChoicesLetter.module.scss";
import { Haptic } from "@/lib/twa/components/Haptic.tsx";
import { motion } from "framer-motion";
import { ChallengeState } from "@/pages/(authenticated)/lesson/Challenge/Challenge.tsx";

interface ChoiceLetterProps {
  text: string;
  challengeId: string;
  onSelect: () => void;
  state: { submitted: boolean };
  attempt?: number;
  isSelected?: boolean; 
}

interface ChoicesLetterProps {
  choices: Choice[];
  currentChoice: Choice | null;
  setChoice: React.Dispatch<React.SetStateAction<Choice | null>>;
  state?: ChallengeState;
}


const ChoicesLetter: React.FC<ChoicesLetterProps> = ({
  choices,
  currentChoice,
  setChoice,
  state,
}) => {
  const handleSelect = (choice: Choice) => {
    if (state?.submitted) {
      return;
    }
    setChoice(choice);
  };

  return (
    <div className={styles.choices}>
      {choices.map((choice, index) => (
        <button
          key={index}
          className={`${styles.choice} ${
            currentChoice?.text === choice.text ? styles.selected : ""
          }`}
          onClick={() => handleSelect(choice)}
          disabled={state?.submitted}
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
};

const ChoiceLetter: React.FC<ChoiceLetterProps> = ({
  text,
  challengeId,
  onSelect,
  state,
  attempt = 0,
  isSelected = false, 
}) => {
  return (
    <Haptic type={"impact"} value={"medium"} disabled={state?.submitted} asChild>
      <motion.div
        role={"radio"}
        onClick={onSelect}
        className={cn(styles.choice, {
          [styles["choice_not-submitted"]!]: !state?.submitted,
          [styles["choice_selected"]!]: isSelected, // Добавляем стиль для выбранной буквы
        })}
        layoutId={`choiceLetter-${challengeId}-${text}-${attempt}`}
        transition={{ duration: 0.2 }}
      >
        <span className={styles.choice__text}>{text}</span>
      </motion.div>
    </Haptic>
  );
};
export { ChoicesLetter, ChoiceLetter };
