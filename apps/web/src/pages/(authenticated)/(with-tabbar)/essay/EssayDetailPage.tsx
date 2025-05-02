import React from "react";
import styles from "./EssayDetailPage.module.scss";

export default function EssayDetailPage() {
  const handleBuy = () => {
    alert("Вы купили сочинение!");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <img
          className={styles.image}
          src="https://images.unsplash.com/photo-1703431058491-55e55037a81e?fit=crop&w=800&q=80"
          alt="Тургенев, Как быть человеком?"
        />
        <div className={styles.content}>
          <h1 className={styles.title}>Тургенев, “Как быть человеком?”</h1>
          <p className={styles.description}>
            Как быть человеком – очень интересный вопрос, который задает Тургенев в своем рассказе.
            Попробуй понять Тургенева вместе с нами.
          </p>
        </div>
      </div>

      <button className={styles.buyButton} onClick={handleBuy}>
        КУПИТЬ
      </button>
    </div>
  );
}
