import styles from "./UserEssay.module.scss";
import { getUserEssay, getEssay } from "@/services/api/essays";
import { useQuery } from "@tanstack/react-query";
import { useCloudStorage } from "@/lib/twa/hooks";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage";
import { useParams } from "react-router-dom";
import { FileEmoji } from "@repo/ui/emojis";
import { BackButton } from "@/lib/twa/components/BackButton";
import { Skeleton } from "@repo/ui";

export default function UserEssayPage() {
  const params = useParams<{ purchaseEssayId: string }>();
  const cloudStorage = useCloudStorage();

  // First query to fetch user essay data
  const {
    data: userEssayData,
    isLoading: userEssayLoading,
    error: userEssayError,
  } = useQuery({
    queryKey: ["userEssays", params.purchaseEssayId],
    queryFn: async () => {
      const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
      const purchaseEssayId = String(params.purchaseEssayId);
      return getUserEssay({ id: purchaseEssayId, token });
    },
    enabled: !!params.purchaseEssayId,
  });

  // Second query to fetch the base essay (depends on userEssayData)
  const {
    data: essayData,
    isLoading: essayLoading,
    error: essayError,
  } = useQuery({
    queryKey: ["essays", userEssayData?.essay_id],
    queryFn: async () => {
      const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
      return getEssay({ id: userEssayData!.essay_id, token });
    },
    enabled: !!userEssayData,
  });

  // Loading states
  if (userEssayLoading || essayLoading) {
    return <UserEssaySectionLoading />;
  }

  // Error states
  if (userEssayError || essayError) {
    return <div className={styles.error}>Ошибка загрузки</div>;
  }

  // Data not ready yet
  if (!userEssayData || !essayData) {
    return <UserEssaySectionLoading />;
  }

  return (
    <>
      <BackButton onClick={() => window.history.back()} />
      <div className={styles.wrapper}>
        <h1 className={styles.title}>{essayData.title}</h1>

        {userEssayData.status === "bought" ? (
          <BoughtEssayView userEssayData={userEssayData} />
        ) : (
          <InProgressEssayView userEssayData={userEssayData} />
        )}
      </div>
    </>
  );
}

const BoughtEssayView = ({ userEssayData }: { userEssayData: any }) => (
  <>
    <div className={styles.section}>
      <h2 className={styles.subtitle}>Текст сочинения</h2>
      <div className={styles.fileBox}>
      <FileEmoji size={25}>
        <span className={styles.fileName}>Текст появится после старта</span>
      </div>
    </div>

    <div className={styles.statusBlock}>
      <p>
        Статус: <span className={styles.status}>не начато</span>
      </p>
      <p>Выбрать дедлайн: {new Date(userEssayData.deadline).toLocaleDateString()}</p>
    </div>

    <div className={styles.complete}>
      <button className={styles.button}>Начать</button>
    </div>
  </>
);

const InProgressEssayView = ({ userEssayData }: { userEssayData: any }) => (
  <>
    <div className={styles.section}>
      <h2 className={styles.subtitle}>Текст сочинения</h2>
      <div className={styles.fileBox}>
        <FileEmoji size={25}>
        <span className={styles.fileName}>26.pdf</span>
      </div>
    </div>

    <div className={styles.section}>
      <h2 className={styles.subtitle}>Твое сочинение</h2>
      <div className={styles.fileBox}>
        <img src="/icons/folder-icon.png" alt="file" className={styles.fileIcon} />
        <span className={styles.fileName}>{userEssayData.download_essay_file_url}</span>
      </div>
    </div>

    <div className={styles.statusBlock}>
      <p>
        Статус: <span className={styles.status}>{translateStatus(userEssayData.status)}</span>
      </p>
      <p>Твой дедлайн: {new Date(userEssayData.deadline).toLocaleDateString()}</p>
    </div>

    <div className={styles.complete}>
      <button className={styles.button}>Купить</button>
    </div>
  </>
);

const translateStatus = (status: string) => {
  switch (status) {
    case "in_progress":
      return "в процессе";
    case "in_review":
      return "на проверке";
    case "reviewed":
      return "проверено";
    default:
      return status;
  }
};

const UserEssaySectionLoading = () => (
  <section className="wrapper">
    <div className={styles.cards}>
      <Skeleton
        style={{
          height: "65px",
          borderRadius: "var(--rounded-2xl)",
          gridColumn: "span 2",
        }}
      />
    </div>
  </section>
);