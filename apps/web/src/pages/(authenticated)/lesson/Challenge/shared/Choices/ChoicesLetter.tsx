import { Choice } from "@/models/Session.ts";
import React from "react";
import cn from "classnames";

import styles from "./ChoicesLetter.module.scss";
import { Haptic } from "@/lib/twa/components/Haptic.tsx";
import { motion } from "framer-motion";
import { ChallengeState } from "@/pages/(authenticated)/lesson/Challenge/Challenge.tsx";

interface ChoicesLetterProps {
  attempt?: number;
  challengeId: string;
  choices?: Choice[];

  currentChoice: Choice | null;
  setChoice: React.Dispatch<React.SetStateAction<Choice | null>>;

  state?: ChallengeState;
}

interface ChoiceLetterProps {
  challengeId: string;
  attempt?: number;
  text: string;
  onSelect?: () => void;
  state?: ChallengeState;
}


const ChoicesLetter: React.FC<ChoicesLetterProps> = ({
  challengeId,
  attempt,
  choices,
  currentChoice,
  setChoice,
  state,
}) => {
  if (!choices) {
    return null;
  }

  return (
    <div className={styles.choices}>
      {choices.map((choice) => (
        <div className={styles["choice-wrapper"]}>
          {currentChoice !== choice && (
            <ChoiceLetter
              key={choice.text}
              challengeId={challengeId}
              text={choice.text}
              onSelect={() => (currentChoice ? undefined : setChoice(choice))}
              state={state}
              attempt={attempt}
            />
          )}
          <div className={styles.choice__skeleton} />
        </div>
      ))}
    </div>
  );
};

const ChoiceLetter: React.FC<ChoiceLetterProps> = ({ text, challengeId, onSelect, state, attempt = 0 }) => {
  return (
    <Haptic type={"impact"} value={"medium"} disabled={state?.submitted} asChild>
      <motion.div
        role={"radio"}
        onClick={onSelect}
        className={cn(styles.choice, { [styles["choice_not-submitted"]!]: !state?.submitted })}
        layoutId={`choiceLetter-${challengeId}-${text}-${attempt}`}
        transition={{ duration: 0.2 }}
      >
        <span className={styles.choice__text}>{text}</span>
      </motion.div>
    </Haptic>
  );
};

export { ChoicesLetter, ChoiceLetter };
