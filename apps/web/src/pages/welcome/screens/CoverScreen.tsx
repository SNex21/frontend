import { FC } from "react";
import styles from "../Welcome.module.scss";
import { Haptic } from "@/lib/twa/components/Haptic";
import { Button } from "@repo/ui";
import { motion } from "framer-motion";

interface CoverScreenProps {
  onButtonClick: () => void;
}

const CoverScreen: FC<CoverScreenProps> = ({ onButtonClick }) => {
  return (
    <motion.div className={styles.cover} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <div className={styles.cover__content}>
        <motion.div
          initial={{
            opacity: 0,
            filter: "blur(10px)",
            transform: "translateY(50px)",
          }}
          animate={{
            opacity: 1,
            filter: "blur(0)",
            transform: "translateY(0)",
          }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <svg width="82" height="103" viewBox="0 0 82 103" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M42.4636 43.5968L26.7534 11.0303C24.8274 7.03764 20.7857 4.5 16.3528 4.5C7.78856 4.5 2.2043 13.4956 6.00395 21.1708L30.1757 69.9973L24.0556 83.4679C20.857 90.5082 26.004 98.5 33.7369 98.5C37.9195 98.5 41.7136 96.0481 43.4318 92.2347L76.2081 19.4923C79.3769 12.4596 74.233 4.5 66.5194 4.5C62.2975 4.5 58.4761 6.99924 56.7838 10.8671L42.4636 43.5968Z"
              fill="url(#paint0_linear_4217_343)"
              stroke="white"
              strokeWidth="9"
            />
            <defs>
              <linearGradient
                id="paint0_linear_4217_343"
                x1="40.5"
                y1="9"
                x2="40.5"
                y2="94"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#77099E" />
                <stop offset="0.523889" stopColor="#500CE1" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{
            opacity: 0,
            filter: "blur(10px)",
            transform: "translateY(50px)",
          }}
          animate={{
            opacity: 1,
            filter: "blur(0)",
            transform: "translateY(0)",
          }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          Готовься к ЕГЭ
          <br />
          по русскому
          <br />
          <span className={styles.title_marked}>в удобном</span> формате
        </motion.h1>
      </div>
      <motion.div
        className={styles.cover__button}
        initial={{
          opacity: 0,
          filter: "blur(10px)",
          transform: "translateY(50px)",
        }}
        animate={{
          opacity: 1,
          filter: "blur(0)",
          transform: "translateY(0)",
        }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <Haptic type="impact" value="medium" event="onTouchStart" asChild>
          <Button onClick={onButtonClick}>ПОЕХАЛИ</Button>
        </Haptic>
      </motion.div>
    </motion.div>
  );
};

export { CoverScreen };

