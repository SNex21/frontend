import { Button } from "@repo/ui";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import styles from "./Lesson.module.scss";
import dayjs from "dayjs";
import { AlarmClockEmoji, DirectHitEmoji } from "@repo/ui/emojis";
import { Haptic } from "@/lib/twa/components/Haptic.tsx";
import { Link, useNavigate } from "react-router-dom"; // Добавляем useNavigate
import { Xmark } from "@repo/ui/icons";
import { useCloudStorage } from "@/lib/twa/hooks";
import { IS_FIRST_START, saveIsFirstStart } from "@/services/auth/storage.ts";

interface LessonCompleteProps {
  startDate: number | null;
  correctPercentage: number;
  onRestart: () => void; // Новый пропс для перезапуска сессии
}

interface SummaryCardProps {
  i: number;
  icon?: React.ReactNode;
}

const LessonComplete: React.FC<LessonCompleteProps> = ({ startDate, correctPercentage, onRestart }) => {
  const wastedTime = React.useMemo(() => (startDate ? new Date().getTime() - startDate : null), [startDate]);
  const cloudStorage = useCloudStorage();
  const [isFirstStart, setIsFirstStart] = useState<boolean | null>(null);
  const navigate = useNavigate(); // Инициализируем useNavigate

  // Проверяем значение IS_FIRST_START при монтировании компонента
  useEffect(() => {
    cloudStorage
      .getItem(IS_FIRST_START)
      .then((value) => {
        console.log(value)
        setIsFirstStart(value === "true"); // Преобразуем строку в булево значение
        saveIsFirstStart('false'); // Сохраняем значение false после первого запуска
      })
      .catch((error) => {
        console.error("Ошибка при получении значения из cloud storage:", error);
      });
  }, [cloudStorage]);

  // Обработчик нажатия на кнопку
  const handleButtonClick = () => {
    if (isFirstStart === true) {
      navigate("/home"); // Переход на /home, если isFirstStart === true
    } else {
      onRestart(); // Вызов функции перезапуска, если isFirstStart === false
    }
  };

  return (
    <motion.div
      className={styles.complete}
      initial={{ opacity: 0, transform: "translateX(100%)" }}
      animate={{ opacity: 1, transform: "translateX(0)", transition: { delay: 0.2, duration: 0.4, ease: "ease" } }}
      exit={{ opacity: 0, transform: "translateX(0)" }}
    >
      <Haptic type={"impact"} value={"light"} asChild>
        <Link to="/">
          <button className={styles.complete__out_button}>
            <Xmark size={20} />
          </button>
        </Link>
      </Haptic>
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
        {/* Кнопка с динамическим текстом и обработчиком */}
        <Button onClick={handleButtonClick}>
          {isFirstStart === null ? "Загрузка..." : isFirstStart ? "ЗАВЕРШИТЬ" : "РЕШАТЬ ЕЩЁ!"}
        </Button>
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
