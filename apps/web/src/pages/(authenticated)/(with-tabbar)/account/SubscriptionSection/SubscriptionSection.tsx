import { FC } from "react";
import { Haptic } from "@/lib/twa/components/Haptic";
import { Link } from "react-router-dom";
import styles from "./SubscriptionSection.module.scss";
import { ArrowIcon } from "@repo/ui/icons";
import { СonfettiEmoji } from "@repo/ui/emojis";
import { LightningEmoji } from "@repo/ui/emojis";
import cn from "classnames";

import { useUser } from "@/providers/AuthProvider/AuthProvider";
import { useCloudStorage } from "@/lib/twa/hooks";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionInfo } from "@/services/api/subscriptions";
import { Skeleton } from "@repo/ui";


interface SubscriptionCardProps {
  emoji?: React.ReactNode;
  title: string;
  icon: React.ReactNode;
  description?: string;
  isSm?: boolean;
  href?: string;
}

const SubscriptionSection: FC = () => {
  const user = useUser();
  const cloudStorage = useCloudStorage();
  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () =>
      getSubscriptionInfo({
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
      }),
  });
  if (isLoading || !subscription) {
    return <SubscriptionSectionLoading />;
  }
  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-"); // Разбиваем строку на компоненты
    return `${day}.${month}.${year}`; // Собираем в нужном формате
  };
  return (
      <section className={cn("wrapper", styles.section)}>
        <h2 className={styles.section__heading}>Подписка</h2>
        {!user.subscription ? (
          <SubscriptionCardWithoutSub
          emoji={<LightningEmoji size={19} />}
          title="Подключи Учи-бот Плюс!"
          description="Получи доступ ко всем заданиям ЕГЭ-2025 от команды Учи-Бота по удобному тарифу"
          href={"/subscription"}
          icon={<ArrowIcon size={25} />}
        />
        ) : (
          <SubscriptionCard
          emoji={<СonfettiEmoji size={38} />}
          title={`Подписка "${subscription.plan.title}"`}
          description={`Действует до ${formatDate(subscription.end_date)}`}
          href={"/subscription"}
          icon={<ArrowIcon size={25} />}
        />
        )}
      </section>
      )
    };

const SubscriptionCard: FC<SubscriptionCardProps> = ({ emoji, title, description, icon, isSm = false, href = "" }) => {
  return (
    <Haptic type="impact" value="medium" asChild>
      <Link to={href} className={styles.card}>
        <div className={styles.card__content}>
        {emoji && <div className={styles.card__emoji}>{emoji}</div>}
          <h3
            className={cn(styles.card__content__title, {
              [styles.card__content__title_sm!]: isSm,
            })}>
            {title}
          </h3>
          {description && <p className={styles.card__content__description}>{description}</p>}
        </div>
        <div className={styles.card__icon}>
          <span className={styles.card__icon_arrow}>{icon}</span>
        </div>
      </Link>
    </Haptic>
  );
};

const SubscriptionCardWithoutSub: FC<SubscriptionCardProps> = ({ emoji, title, description, icon, isSm = false, href = "" }) => {
  return (
    <Haptic type="impact" value="medium" asChild>
      <Link to={href} className={styles.card}>
      {emoji && <div className={styles.card__emoji}>{emoji}</div>}
        <div className={styles.card__content}>
          <h3
            className={cn(styles.card__content__title, {
              [styles.card__content__title_sm!]: isSm,
            })}>
            {title}
          </h3>
          {description && <p className={styles.card__content__description}>{description}</p>}
        </div>
        <div className={styles.card__icon}>
          <span className={styles.card__icon_arrow}>{icon}</span>
        </div>
      </Link>
    </Haptic>
  );
};

const SubscriptionSectionLoading = () => {
  return (
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
};

export { SubscriptionSection };
