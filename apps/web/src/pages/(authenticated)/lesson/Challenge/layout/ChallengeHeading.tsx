import React from "react";
import styles from "../Challenge.module.scss";
import { Challenge } from "@/models/Session";

interface ChallengeHeadingProps {
  challenge: Challenge;
  children?: React.ReactNode;
}

const ChallengeHeading: React.FC<ChallengeHeadingProps> = ({ challenge, children }) => {
  if (!children) {
    return null;
  }

  return (
    <>
      <div className={styles.heading}>
        {(challenge.isWorkOnMistakes || challenge.isLocalWom) && <p>Исправляем ошибки</p>}
        {challenge.isHard && <p>Сложное задание</p>}
        <h1 className={styles.heading__title}>{children}</h1>
    </div>
  </>
  );
};

export { ChallengeHeading };
