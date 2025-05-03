import styles from "./EssayDetail.module.scss";
import { BackButton } from "@/lib/twa/components/BackButton";
import { useNavigate } from "react-router-dom";

export default function EssayDetailPage() {
  const navigate = useNavigate();

  return (
    <>
      <BackButton onClick={() => navigate("/essay")} />
      <div className={styles.wrapper}>
        
        <div className={styles.card}>
          <img
            className={styles.image}
            src="https://img.goodfon.ru/wallpaper/big/8/4e/badfon-full-hd-cvety-priroda-vesna.webp"
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

        <div className={styles.complete}>
          <button
            className={styles.button}
          >
            Купить
        </button>
      </div>
      </div>
    </>
  );
}
