import { FC } from "react";
import { Haptic } from "@/lib/twa/components/Haptic";
import { Link } from "react-router-dom";
import styles from "./SubscriptionSection.module.scss";
import cn from "classnames";

import { useUser } from "@/providers/AuthProvider/AuthProvider";
import { useCloudStorage } from "@/lib/twa/hooks";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionInfo } from "@/services/api/subscriptions";
import { Skeleton } from "@repo/ui";


interface SubscriptionCardProps {
  title: string;
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
          <SubscriptionCard
          title="У тебя пока нет подписки"
          description="Открывай доступ ко всем заданиям с подпиской!"
          href={"/"}с
        />
        ) : (
          <SubscriptionCard
          title={`Подписка ${subscription.plan.title}`}
          description={`Действует до ${formatDate(subscription.end_date)}`}
          href={"/"}
        />
        )}
      </section>
      )
    };

const SubscriptionCard: FC<SubscriptionCardProps> = ({ title, description, isSm = false, href = "" }) => {
  return (
    <Haptic type="impact" value="medium" asChild>
      <Link to={href} className={styles.card}>
        <div className={styles.card__content}>
          <h3
            className={cn(styles.card__content__title, {
              [styles.card__content__title_sm!]: isSm,
            })}>
            {title}
          </h3>
          {description && <p className={styles.card__content__description}>{description}</p>}
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
