import { EssaySection } from "./EssaySection";
import pageStyles from "../Page.module.scss";
import styles from "./Essay.module.scss";
import Gradient from "../../../../assets/fonts/images/Gradient.png";
import Vector from "../../../../assets/fonts/images/Vector.png";
import { useEffect } from "react";

declare let Telegram: any; 

export default function EssayPage() {
  useEffect(() => {
    if (Telegram && Telegram.WebApp) {
      const tg = Telegram.WebApp;
      // Проверяем, готов ли Web App
      if (tg.ready) {
        tg.ready();
      }
      // Отключаем вертикальные свайпы на этой странице
      tg.disableVerticalSwipes();
      tg.enableClosingConfirmation();
      return () => {
        tg.disableVerticalSwipes();
        tg.enableClosingConfirmation();
      };
    }
  }, []);
  return (
    <><div
      className={styles.container}
      style={{ backgroundImage: `url(${Gradient})` }}>
      <img
        src={Vector}
        alt="Логотип"
        className={styles.logo} />
      <p className={styles.text}>
        Раздел <span className={styles.highlight}>Ababababababba</span> находится в активной
        разработке команды <span className={styles.highlight}>Учи-Бота</span>. Следи за обновлениями в Telegram канале.
      </p>
      <a href="https://t.me/ege_uchibot" target="_blank" rel="noopener noreferrer">
        <button className={styles.button}>Перейти в канал</button>
      </a>
    </div><div className={pageStyles.main}>
        <EssaySection /> 
      </div></>
  );
}