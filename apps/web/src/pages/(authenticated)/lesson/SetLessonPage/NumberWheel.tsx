import React, { useState } from "react";
import styles from "./SetLessonPage.module.scss";

const NumberWheel = ({ values, initialValue, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [translateY, setTranslateY] = useState(0);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    let newValue = selectedValue;

    if (delta > 0) {
      // Прокрутка вниз
      newValue = values[Math.max(values.indexOf(selectedValue) + 1, 0)];
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
        tabIndex="0"
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
