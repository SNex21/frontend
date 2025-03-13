import { FC } from "react";
import styles from "../Welcome.module.scss";
import { Haptic } from "@/lib/twa/components/Haptic";
import { Button } from "@repo/ui";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

declare let Telegram: any;

const OnbordingScreen: FC = () => {
  const navigate = useNavigate();
  const linkPath = "/lesson/topic/2?amount=${10}";

  // Флаг первого запуска (по умолчанию true)
  const [isFirstLaunch, setIsFirstLaunch] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    // Проверяем флаг первого запуска в Cloud Storage
    Telegram.WebApp.CloudStorage.getItem("isFirstLaunch").then((value: string | null) => {
      if (value === null) {
        // Если флаг не установлен, это первый запуск
        setIsFirstLaunch(true);
        Telegram.WebApp.CloudStorage.setItem("isFirstLaunch", "false");
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  // Если флаг ещё не загружен, показываем загрузку
  if (isFirstLaunch === null) {
    return <div>Загрузка...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateX(100%)" }}
      animate={{ opacity: 1, transform: "translateX(0)" }}
      exit={{ opacity: 0, transform: "translateX(-100%)", transition: { delay: 0.5 } }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={styles.onbording}
    >
      <div className={styles.onbording__content}>
        {/* Заголовок */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={styles.onbording__title}
        >
          Привет, это Учи-бот — твой помощник для подготовки к ЕГЭ по русскому
        </motion.h1>

        {/* Описание */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={styles.onbording__description}
        >
          Сейчас мы тебе покажем основной функционал нашего сервиса, чтобы тебе было проще ориентироваться в боте
        </motion.h2>
      </div>

      {/* Кнопка */}
      <div className={styles.onbording__button}>
        <Haptic type="impact" value="medium" event="onTouchStart" asChild>
          <Button onClick={() => navigate(linkPath)}>
            {isFirstLaunch ? "ЗАВЕРШИТЬ" : "УЧИТЬСЯ!"}
          </Button>
        </Haptic>
      </div>
    </motion.div>
  );
};

export { OnbordingScreen };
