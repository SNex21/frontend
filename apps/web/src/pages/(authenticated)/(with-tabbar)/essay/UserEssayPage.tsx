import styles from "./UserEssayDetail.module.scss";
import { BackButton } from "@/lib/twa/components/BackButton";

export default function UserEssayPage() {
  return (
    <>
      <BackButton onClick={() => window.history.back()} />
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Тургенев, “Как быть человеком?”</h1>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Текст сочинения</h2>
          <div className={styles.fileBox}>
            <img
              src="/icons/folder-icon.png"
              alt="file"
              className={styles.fileIcon}
            />
            <span className={styles.fileName}>26.pdf</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Твое сочинение</h2>
          <div className={styles.fileBox}>
            <img
              src="/icons/folder-icon.png"
              alt="file"
              className={styles.fileIcon}
            />
            <span className={styles.fileName}>abvgd.docx</span>
          </div>
        </div>

        <div className={styles.statusBlock}>
          <p>
            Статус: <span className={styles.status}>на проверке</span>
          </p>
          <p>Твой дедлайн: 21.05.2025</p>
        </div>
      </div>
    </>
  );
}
