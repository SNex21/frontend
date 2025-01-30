import React, { useState } from 'react';
import styles from './SetLessonPage.module.scss';

interface WheelItem {
  value: number;
  label: string;
}

const HorizontalWheelSelector: React.FC<{ items: WheelItem[]; onChange: (value: number) => void }> = ({ items, onChange }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      // Scroll up (left)
      setSelectedIndex((prevIndex) => Math.max(0, prevIndex - 1));
    } else {
      // Scroll down (right)
      setSelectedIndex((prevIndex) => Math.min(items.length - 1, prevIndex + 1));
    }
  };

  const handleClick = (index: number) => {
    setSelectedIndex(index);
    onChange(items[index].value);
  };

  return (
    <div className={styles.wheelContainer} onWheel={handleScroll}>
      <div className={styles.wheelItems}>
        {items.map((item, index) => (
          <div
            key={item.value}
            className={`${styles.wheelItem} ${selectedIndex === index ? styles.active : ''}`}
            onClick={() => handleClick(index)}
            style={{
              transform: `translateX(${(index - selectedIndex) * 100}%)`,
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalWheelSelector;
