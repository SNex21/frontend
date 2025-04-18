import React, { FC, useCallback, useState } from "react";
import { Button } from "@repo/ui";
import styles from "../Challenge.module.scss";
import { ChallengeState } from "@/pages/(authenticated)/lesson/Challenge/Challenge.tsx";
import cn from "classnames";
import { Haptic } from "@/lib/twa/components/Haptic.tsx";
import { Challenge } from "@/models/Session";

interface ChallengeSubmitProps {
  onSubmit: () => void;
  next: (challenge: Challenge, isCorrect: boolean) => Promise<void>;

  challenge: Challenge;

  state: ChallengeState;
  correctText?: React.ReactNode;
  explanation?: string;

  disabled?: boolean;
}

const ChallengeSubmit: FC<ChallengeSubmitProps> = ({
  onSubmit,
  next: nextLegacy,
  challenge,
  state,
  disabled,
  correctText,
  explanation,
}) => {
  const [nextCalled, setNextCalled] = useState(false);
  // ПОТОМ УБРАТЬ ПРАВИЛЬНЫЙ ОТВЕТ
  const next = useCallback(async () => {
    await nextLegacy(challenge, !state.wrong);
    setNextCalled(true);
  }, [nextLegacy, challenge, state.wrong]);

  return (
    <div
      className={cn(styles.submit, {
        [styles.submit_ok!]: state.submitted && !state.wrong,
        [styles.submit_wrong!]: state.submitted && state.wrong,
      })}
    >
      <Haptic type={"impact"} value={"medium"} disabled={!state?.submitted} asChild>
        <Button
          onClick={state.submitted ? (nextCalled ? undefined : next) : onSubmit}
          disabled={disabled}
          style={{ zIndex: 10_100, position: "relative" }}
        >
          {!state.submitted ? "ПРОВЕРИТЬ" : state.wrong ? "ПОНЯТНО" : "ДАЛЬШЕ"}
        </Button>
      </Haptic>
      
      <div className={cn(styles.submit__panel, { [styles.submit__panel_closed!]: !state.submitted })}>
        <div className={styles.submit__panel__content}>
          {state.wrong ? (
            <>
              <div className={styles.submit__panel__heading}>
                <p className={styles.submit__panel__heading__p}> &#x274C;</p>
                <h1 className={styles.submit__panel__heading__title}>Неверно</h1>
              </div>
              {correctText && (
                <div className={styles["submit__panel__error-info"]}>
                  <span className={styles["submit__panel__error-info__text"]}>{correctText}</span> 
                </div> 
              )}
            </>
          ) : (
            <div className={styles.submit__panel__heading}>
              <p className={styles.submit__panel__heading__p}> &#9989;</p>
              <h1 className={styles.submit__panel__heading__title}>Верно!</h1>
            </div>
          )}
           <a
              // href={`${import.meta.env.TELEGRAM_BOT_LINK}?start=report`} 
              href="https://t.me/Example_chat_courses_bot?start=report"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.submit__panel__heading__report}
            >
              Нашли у нас ошибку?
          </a>
          {explanation && (
            <div className={styles["submit__panel__error-info"]}>
              <span className={styles["submit__panel__error-info__title"]}>Объяснение:</span>
              <span className={styles["submit__panel__error-info__text"]}>{explanation}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export { ChallengeSubmit };
