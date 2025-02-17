import { StatsSection } from "./StatsSection";
import { UserSection } from "./UserSection";
import { SubscriptionSection } from "./SubscriptionSection";
import pageStyles from "../Page.module.scss";
import styles from "./Account.module.scss";
import { version } from "../../../../../package.json";
import { useEffect } from "react";

declare let Telegram: any;

export default function AccountPage() {
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
    <>
      <div className={pageStyles.main}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <UserSection />
          <StatsSection />
          <SubscriptionSection />
        </div>
      </div>
      <div className={styles.info}>
        <p>Учи-бот © {new Date().getFullYear()}</p>
        <p>Версия {version}</p>
      </div>
    </>
  );
}
