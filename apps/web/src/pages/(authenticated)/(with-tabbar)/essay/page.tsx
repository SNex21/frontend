import styles from "./Essay.module.scss";

export default function EssayPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <h1 className={styles.title}>Твои сочинения</h1>
        <div className={styles.emptyBox}>
          <p className={styles.emptyText}>тут будут отображаться твои сочинения</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subtitle}>Магазин сочинений</h2>
        <div className={styles.shopGrid}>
          <div className={styles.card}>
            <img src="/images/gator-plane.png" alt="Тургенев" className={styles.cardImage} />
            <p className={styles.cardText}>Тургенев, “Как быть человеком?”</p>
          </div>
          <div className={styles.card}>
            <img src="/images/shark-sneakers.png" alt="Маяковский" className={styles.cardImage} />
            <p className={styles.cardText}>Маяковский, “А вы любите розы?”</p>
          </div>
        </div>
      </div>

      <nav className={styles.navbar}>
        <div className={styles.navItemActive}>
          <img src="/icons/home.svg" alt="Главная" />
          <span>Главная</span>
        </div>
        <div className={styles.navItem}>
          <img src="/icons/book.svg" alt="Теория" />
          <span>Теория</span>
        </div>
        <div className={styles.navItem}>
          <img src="/icons/user.svg" alt="Аккаунт" />
          <span>Аккаунт</span>
        </div>
      </nav>
    </div>
  );
}
