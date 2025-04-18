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
      <a
        // href={`${import.meta.env.TELEGRAM_BOT_LINK}?start=report`} 
        href="https://t.me/Example_chat_courses_bot?start=report"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.submit__panel__heading__report}
      >
        Сообщить об ошибке
    </a>
    </div>
  </>
  );
};

export { ChallengeHeading };
