import React, { useState } from "react";
import styles from "./SetLessonPage.module.scss";

interface NumberWheelProps {
  values: number[];
  initialValue: number;
  onChange: (newValue: number) => void;
}

const NumberWheel: React.FC<NumberWheelProps> = ({ values, initialValue, onChange }) => {
  // Убедимся, что initialValue есть в values или возьмем первое значение по умолчанию
  const initialValidValue = values.includes(initialValue) ? initialValue : values[0];
  
  const [selectedValue, setSelectedValue] = useState<number>(initialValidValue);
  const [translateY, setTranslateY] = useState<number>(0);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    let newValue = selectedValue;

    const currentIndex = values.indexOf(selectedValue);
    if (delta > 0) {
      // Прокрутка вниз
      newValue = values[Math.min(currentIndex + 1, values.length - 1)];
    } else {
      // Прокрутка вверх
      newValue = values[Math.max(currentIndex - 1, 0)];
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
