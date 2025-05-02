import styles from "./Essay.module.scss";

const userEssays = [
  { title: 'Маяковский, “А вы любите розы?”', status: 'на проверке' },
  { title: 'Маяковский, “А я на них срал”', status: 'проверено' },
];

const shopEssays = [
  { title: 'Тургенев, “Как быть человеком?”', img: '/images/turgenev.png' },
  { title: 'Пушкин, “Димоооон”', img: '/images/pushkin.png' },
];

export default function EssayPage() {
  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <h1 className={styles.title}>Твои сочинения</h1>
        <div className={styles.essayList}>
          {userEssays.map((essay, index) => (
            <div className={styles.essayItem} key={index}>
              <span>{essay.title}</span>
              <span
                className={
                  essay.status === 'проверено'
                    ? styles.statusChecked
                    : styles.statusPending
                }
              >
                {essay.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subtitle}>Магазин сочинений</h2>
        <div className={styles.shopGrid}>
          {shopEssays.map((essay, index) => (
            <div className={styles.card} key={index}>
              <img className={styles.cardImage} src={essay.img} alt="" />
              <div className={styles.cardText}>{essay.title}</div>
            </div>
          ))}
        </div>
      </section>

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
