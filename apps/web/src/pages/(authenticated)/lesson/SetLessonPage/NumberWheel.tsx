import React, { useState } from "react";
import styles from "./SetLessonPage.module.scss";

interface NumberWheelProps {
  values: number[];
  initialValue: number;
  onChange: (newValue: number) => void;
}

const NumberWheel: React.FC<NumberWheelProps> = ({ values, initialValue, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<number>(initialValue);
  const [translateY, setTranslateY] = useState<number>(0);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    let newValue = selectedValue;

    if (delta > 0) {
      // Прокрутка вниз
      newValue = values[Math.min(values.indexOf(selectedValue) + 1, values.length - 1)];
    } else {
      // Прокрутка вверх
      newValue = values[Math.max(values.indexOf(selectedValue) - 1, 0)];
    }

    setSelectedValue(newValue);
    setTranslateY((prev) => prev + (delta > 0 ? -50 : 50));
    onChange(newValue);
  };

  return (
    <div className={styles.wheel__container}>
      <div
        className={styles.wheel__wrapper}
        onWheel={handleWheel}
        tabIndex={0}
        style={{ transform: `translateY(${translateY}px)` }}
      >
        <ul className={styles.wheel__list}>
          {values.map((value, index) => (
            <li
              key={value}
              className={styles.wheel__item}
              style={{
                transform: `translateY(${
                  (index - values.indexOf(selectedValue)) * 50
                }px)`,
              }}
            >
              {value}
            </li>
          ))}
        </ul>
      </div>
      <span className={styles.wheel__value}>{selectedValue}</span>
    </div>
  );
};

export default NumberWheel;
