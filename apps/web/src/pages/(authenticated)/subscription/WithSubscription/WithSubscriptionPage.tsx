import { FC } from "react";
import { Haptic } from "@/lib/twa/components/Haptic";
import { Link } from "react-router-dom";
import styles from "./WithSubscribe.module.scss";
import cn from "classnames";
import { BackButton } from "@/lib/twa/components/BackButton";
import { useNavigate } from "react-router-dom";

import { useCloudStorage } from "@/lib/twa/hooks";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionInfo } from "@/services/api/subscriptions";
import { Skeleton } from "@repo/ui";

interface WithSubscriptionCardProps {
    title: string;
    description?: string;
    price?: number;
    isSm?: boolean;
    href?: string;
  }

export const WithSubscriptionPage: FC = () =>  {
  const navigate = useNavigate();
  const cloudStorage = useCloudStorage();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () =>
      getSubscriptionInfo({
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
      }),
  });

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-"); // Разбиваем строку на компоненты
    return `${day}.${month}.${year}`; // Собираем в нужном формате
  };


  if (isLoading || !subscription) {
    return <SubscriptionSectionLoading />;
  }

  return (
    <div>
        <BackButton onClick={() => navigate("/account")} />
        <section className={cn("wrapper", styles.section)}>
        <h2 className={styles.section__heading}>Подписка</h2>
        <WithSubscriptionCard
        title={`Подписка "${subscription.plan.title}"`}
        description={`Действует до ${formatDate(subscription.end_date)}`}
        price={subscription.price}
        href={"/"}
        />
        </section>
    </div>
    )
  };

const WithSubscriptionCard: FC<WithSubscriptionCardProps> = ({ title, description, price,  isSm = false, href = "" }) => {
return (
  <>
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
        <p className={styles.card__content__description}>
            {price === 0 ? "Бесплатно" : `${price} руб.`}
        </p>
        
        </div>
    </Link>
    
    <footer className={styles.footer}>
        <p className={styles.footer__text}>
          <Link to="/cancel-auto-payment" className={styles.footer__link}>
            отключить автоплатежи
          </Link>
        </p>
      </footer>
    </Haptic>
  </>

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
