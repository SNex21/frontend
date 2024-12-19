import { TheorySection } from "./TheorySection";
import pageStyles from "../Page.module.scss";
import styles from "./Theory.module.scss";
import Gradient from '/home/jacob/Документы/vscodes/frontend-archive/apps/web/src/assets/fonts/Gradient.png';
import Vector from '/home/jacob/Документы/vscodes/frontend-archive/apps/web/src/assets/fonts/Vector.png';


export default function TheoryPage() {
  return (
    <><div
      className={styles.container}
      style={{ backgroundImage: `url(${Gradient})` }}
    >
      <img
        src={Vector}
        alt="Логотип"
        className={styles.logo} />
      <p className={styles.text}>
        Раздел <span className={styles.highlight}>Теория</span> находится в активной
        разработке команды Учибота. Следи за обновлениями в Telegram канале.
      </p>
      <a href="https://t.me/ege_uchibot" target="_blank" rel="noopener noreferrer">
        <button className={styles.button}>Перейти в канал</button>
      </a>
    </div><div className={pageStyles.main}>
        <TheorySection />
      </div></>
  );
}