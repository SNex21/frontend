import { Button } from "@repo/ui";
import { motion } from "framer-motion";
import React from "react";
import styles from "./Lesson.module.scss";
import dayjs from "dayjs";
import { AlarmClockEmoji, DirectHitEmoji } from "@repo/ui/emojis";

interface LessonCompleteProps {
  startDate: number | null;
  correctPercentage: number;
  onRestart: () => void; // Принимаем функцию для перезапуска
}

interface SummaryCardProps {
  i: number;
  icon?: React.ReactNode;
}

const LessonComplete: React.FC<LessonCompleteProps> = ({ startDate, correctPercentage, onRestart }) => {
  const wastedTime = React.useMemo(() => (startDate ? new Date().getTime() - startDate : null), [startDate]);

  return (
    <motion.div
      className={styles.complete}
      initial={{ opacity: 0, transform: "translateX(100%)" }}
      animate={{ opacity: 1, transform: "translateX(0)", transition: { delay: 0.2, duration: 0.4, ease: "ease" } }}
      exit={{ opacity: 0, transform: "translateX(0)" }}
    >
      <div className={styles.complete__content}>
        <div className={styles.complete__info}>
          <h1 className={styles.complete__info__title}>Урок завершен</h1>
          <p className={styles.complete__info__subtitle}>Вы здорово потрудились</p>
        </div>
        <div className={styles.complete__summary}>
          {wastedTime && (
            <>
              <SummaryCard i={0} icon={<AlarmClockEmoji size={20} />}>
                {dayjs(wastedTime).format("m:ss")}
              </SummaryCard>
              <SummaryCard i={1} icon={<DirectHitEmoji size={20} />}>
                {correctPercentage}%
              </SummaryCard>
            </>
          )}
        </div>
      </div>
      <div className={styles.complete__buttons}>
        <Button onClick={onRestart}>РЕШАТЬ ДАЛЬШЕ</Button>
      </div>
    </motion.div>
  );
};

const SummaryCard: React.FC<React.PropsWithChildren<SummaryCardProps>> = ({ i, icon, children }) => {
  return (
    <motion.div
      initial={{ transform: "translateY(20px)", opacity: 0 }}
      animate={{ transform: "translateY(0)", opacity: 1 }}
      transition={{ delay: i * 0.5 + 1.5 }}
      className={styles["summary-card"]}
    >
      {icon}
      <span className={styles["summary-card__text"]}>{children}</span>
    </motion.div>
  );
};

export { LessonComplete };
