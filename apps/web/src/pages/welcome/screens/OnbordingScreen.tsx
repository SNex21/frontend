import { FC } from "react";
import styles from "../Welcome.module.scss";
import { Haptic } from "@/lib/twa/components/Haptic";
import { Button } from "@repo/ui";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const OnbordingScreen: FC = () => {
  const navigate = useNavigate();
  const linkPath = "/lesson/topic/2?amount=${10}";
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
          transition={{ duration: 0.5, delay: 0.2 }}
          className={styles.onbording__title}
        >
          Привет, это Учи-бот — сервис, где можно удобно готовиться к ЕГЭ по русскому.
        </motion.h1>

        {/* Описание */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={styles.onbording__description}
        >
          Чтобы тебе было проще ориентироваться, сейчас мы тебе покажем основной функционал нашего сервиса
        </motion.h2>
      </div>

      {/* Кнопка */}
      <div className={styles.onbording__button}>
        <Haptic type="impact" value="medium" event="onTouchStart" asChild>
          <Button onClick={() => navigate(linkPath)}>УЧИТЬСЯ!</Button>
        </Haptic>
      </div>
    </motion.div>
  );
};

export { OnbordingScreen };
