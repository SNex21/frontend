import styles from "./UserEssay.module.scss";
import { getUserEssay, getEssay, patchStartEssay, submitEssay } from "@/services/api/essays";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCloudStorage } from "@/lib/twa/hooks";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage";
import { useParams } from "react-router-dom";
import { FileEmoji } from "@repo/ui/emojis";
import { BackButton } from "@/lib/twa/components/BackButton";
import { Skeleton } from "@repo/ui";
import { useState } from "react";

export default function UserEssayPage() {
  const params = useParams<{ purchaseEssayId: string }>();
  const cloudStorage = useCloudStorage();
  const [isModalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: userEssayData,
    isLoading: userEssayLoading,
    error: userEssayError,
  } = useQuery({
    queryKey: ["userEssays", params.purchaseEssayId],
    queryFn: async () => {
      const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
      return getUserEssay({ id: String(params.purchaseEssayId), token });
    },
    enabled: !!params.purchaseEssayId,
  });

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

  const startEssayMutation = useMutation({
    mutationFn: async ({
      essay_id,
      deadline,
    }: {
      essay_id: string;
      deadline?: string;
    }) => {
      const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
      return patchStartEssay(
        deadline ? { essay_id, token, deadline } : { essay_id, token }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userEssays", params.purchaseEssayId] });
      queryClient.invalidateQueries({ queryKey: ["essays", userEssayData?.essay_id] });
    },
  });

  if (userEssayLoading || essayLoading) return <UserEssaySectionLoading />;
  if (userEssayError || essayError) return <div className={styles.error}>Ошибка загрузки</div>;
  if (!userEssayData || !essayData) return <UserEssaySectionLoading />;

  return (
    <>
      <BackButton onClick={() => window.history.back()} />
      <div className={styles.wrapper}>
        <h1 className={styles.title}>{essayData.title}</h1>
        {userEssayData.status === "bought" ? (
          <BoughtEssayView userEssayData={userEssayData} onStartClick={() => setModalOpen(true)} />
        ) : userEssayData.status === "in_progress" || userEssayData.status === "in_review" ? (
          <InProgressEssayView userEssayData={userEssayData} />
        ) : (
          <ReviewedEssayView userEssayData={userEssayData} />
        )}
      </div>

      <DeadlineModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(deadline) => {
          startEssayMutation.mutate(
            {
              essay_id: userEssayData.id,
              ...(deadline ? { deadline } : {}),
            },
            {
              onSuccess: () => setModalOpen(false),
            }
          );
        }}
      />
    </>
  );
}

const BoughtEssayView = ({
  userEssayData,
  onStartClick,
}: {
  userEssayData: any;
  onStartClick: () => void;
}) => (
  <>
    <div className={styles.section}>
      <h2 className={styles.subtitle}>Текст сочинения</h2>
      <div className={styles.fileBox}>
        <FileEmoji size={25} />
        <span className={styles.fileName}>Текст появится после старта</span>
      </div>
    </div>

    <div className={styles.statusBlock}>
      <p>
        Статус: <span className={styles.statusBought}>не начато</span>
      </p>
    </div>

    <div className={`${styles.complete} ${styles.animate}`}>
      <button className={styles.button} onClick={onStartClick}>
        Начать
      </button>
    </div>
  </>
);

const InProgressEssayView = ({ userEssayData }: { userEssayData: any }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const cloudStorage = useCloudStorage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile) return;
    setSubmitting(true);
    const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
    try {
      await submitEssay({
        file: uploadedFile,
        purchaseId: userEssayData.id,
        token,
      });
      await queryClient.invalidateQueries({ queryKey: ["userEssays", userEssayData.id] });
    } catch (e) {
      console.error("Ошибка отправки:", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.section}>
        <h2 className={styles.subtitle}>Текст сочинения</h2>
        <div className={styles.fileBox}>
          <FileEmoji size={25} />
          <a href={userEssayData.download_essay_file_url} download="26.pdf">
            <span className={styles.fileName}>26.pdf</span>
          </a>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subtitle}>Твое сочинение</h2>
        <label className={styles.activeFileBox}>
          <FileEmoji size={25} />
          <span className={styles.fileName}>
            {uploadedFile ? uploadedFile.name : "Загрузи сюда свой файл с решением"}
          </span>
          <input type="file" hidden onChange={handleFileChange} />
        </label>
      </div>

      <div className={styles.statusBlock}>
        <p>
          Статус:{" "}
          <span className={styles[`status${capitalizeFirstLetter(userEssayData.status)}`]}>
            {translateStatus(userEssayData.status)}
          </span>
        </p>
        <p>Твой дедлайн: {new Date(userEssayData.deadline).toLocaleDateString()}</p>
      </div>

      <div className={`${styles.complete} ${styles.animate}`}>
        <button
          className={styles.button}
          onClick={handleSubmit}
          disabled={!uploadedFile || isSubmitting}
        >
          {isSubmitting ? "Отправка..." : "Отправить решение"}
        </button>
      </div>
    </>
  );
};

const ReviewedEssayView = ({ userEssayData }: { userEssayData: any }) => (
  <>
    <div className={styles.section}>
      <h2 className={styles.subtitle}>Текст сочинения</h2>
      <div className={styles.fileBox}>
        <FileEmoji size={25} />
        <a href={userEssayData.download_essay_file_url} download="26.pdf">
          <span className={styles.fileName}>26.pdf</span>
        </a>
      </div>
    </div>

    <div className={styles.section}>
      <h2 className={styles.subtitle}>Твое сочинение</h2>
      <div className={styles.fileBox}>
        <FileEmoji size={25} />
        <a href={userEssayData.download_user_file_url} download="file.docx">
          <span className={styles.fileName}>file.docx</span>
        </a>
      </div>
    </div>

    <div className={styles.statusBlock}>
      <p>
        Статус:{" "}
        <span className={styles[`status${capitalizeFirstLetter(userEssayData.status)}`]}>
          {translateStatus(userEssayData.status)}
        </span>
      </p>
      <p>Твой дедлайн: {new Date(userEssayData.deadline).toLocaleDateString()}</p>
    </div>

    <div className={styles.section}>
      <h1 className={styles.subtitle}>Итоговый балл: {userEssayData.score || "—"}</h1>
    </div>

    <div className={styles.section}>
      <h2 className={styles.subtitle}>Рецензия проверяющего</h2>
      <div className={styles.fileBox}>
        <p>{userEssayData.reviewer_comment || "Рецензия отсутствует"}</p>
      </div>
    </div>
  </>
);

const DeadlineModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deadline?: string) => void;
}) => {
  const [deadline, setDeadline] = useState("");

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.title}>Поставь себе дедлайн</h3>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
        <div className={styles.modalButtons}>
          <button onClick={onClose} className={styles.secondaryButton}>Отмена</button>
          <button onClick={() => onSubmit(deadline)} disabled={!deadline} className={styles.button}>
            Сохранить
          </button>
        </div>
        <div className={styles.modalButtons}>
          <button onClick={() => onSubmit()} className={styles.secondaryButton}>
            Без дедлайна
          </button>
        </div>
      </div>
    </div>
  );
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

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function translateStatus(status: string) {
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
}
