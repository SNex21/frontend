import Telegram from '@twa-dev/sdk';
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCloudStorage } from "@/lib/twa/hooks";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPaymentUrl, getSubscriptionInfo } from "@/services/api/subscriptions";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import styles from "./SubscriptionBuy.module.scss";
import { BackButton } from "@/lib/twa/components/BackButton";
import Clock from "../../../../assets/fonts/gifs/clock.gif";
import Confetti from "../../../../assets/fonts/gifs/confetti.gif";


export default function SubscriptionBuyPage() {
  const navigate = useNavigate();
  const params = useParams();
  const cloudStorage = useCloudStorage();
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false); // Ожидание оплаты
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false); // Успешная оплата

  // Состояние для хранения начального значения end_date
  const [initialEndDate, setInitialEndDate] = useState<string | null>(null);

  // Запрос информации о подписке
  const { data: subscription, isLoading: _ } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () =>
      getSubscriptionInfo({
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
      }),
  });

  // Мутация для получения ссылки на оплату
  const { mutate } = useMutation({
    mutationFn: async () => {
      const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
      return getPaymentUrl({
        token,
        plan_id: Number(params.planId),
        email,
      });
    },
    onSuccess: (paymentUrl) => {
      if (paymentUrl?.url) {
        Telegram.openLink(paymentUrl.url); // Редирект на полученный URL
        setIsWaitingForPayment(true); // Начинаем ожидание оплаты
        setInitialEndDate(subscription?.end_date || null); // Сохраняем начальное значение end_date
        startPolling(); // Запускаем циклические запросы
      }
    },
    onError: (error) => {
      console.error("Failed to get payment URL", error);
    },
  });

  // Обработка изменения email
  const handleEmailChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)); // Простая валидация email
  };

  // Обработка нажатия кнопки "Далее"
  const handleButtonClick = () => {
    if (isEmailValid) {
      mutate();
    }
  };

  const handleConfirmationClick = () => {
    navigate(`/`);
  };

  // Функция для запуска циклических запросов
  const startPolling = () => {
    let intervalId: NodeJS.Timeout;

    const pollSubscription = async () => {
      try {
        const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
        const response = await getSubscriptionInfo({ token });

        if (response.end_date !== initialEndDate && response.end_date !== null) {
          // Если end_date изменился, останавливаем запросы и показываем успешный экран
          clearInterval(intervalId);
          setIsPaymentSuccessful(true);
        }
      } catch (error) {
        console.error("Error polling subscription:", error);
      }
    };

    // Запускаем цикл запросов каждые 30 секунд
    intervalId = setInterval(pollSubscription, 5 * 1000);

    // Останавливаем запросы через 10 минут
    setTimeout(() => {
      clearInterval(intervalId);
      setIsPaymentSuccessful(false); // Можно добавить сообщение об ошибке или таймауте
    }, 10 * 60 * 1000);
  };

  return (
    <div className={styles.container}>
      <BackButton onClick={() => navigate("/subscription")} />
      {isPaymentSuccessful ? (
        // Если оплата успешна, показываем сообщение с эмоджи
        <>
          <div className={styles.successContainer}>
            <div className={styles.emojiContainer}>
              <img src={Confetti} alt="Confetti" className={styles.confettiGif} />
            </div>
            <p className={styles.successMessage}>Оплата прошла успешно!</p>
          
          <div className={styles.complete}>
            <button
                className={styles.success_button}
                onClick={handleConfirmationClick}
              >
                К заданиям!
            </button>
          </div>
          </div>
        </>
      ) : isWaitingForPayment ? (
        // Если ожидаем оплату, показываем это сообщение
        <>
          <div className={styles.successContainer}>
            <div className={styles.emojiContainer}>
              <img src={Clock} alt="Clock" className={styles.clockGif} />
            </div>
            <p className={styles.successMessage}>Ожидаем оплату...</p>
          </div>
        </>
      ) : (
        // Иначе показываем форму ввода email
        <div className={styles.formContainer}>
          <label htmlFor="email" className={styles.label}>
            Для оплаты необходимо ввести email для отправки чека:
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            value={email}
            onChange={handleEmailChange}
            placeholder="example@gmail.com"
          />
          <div className={styles.complete}>
            <button
              className={`${styles.button} ${!isEmailValid ? styles.buttonInactive : ""}`}
              onClick={handleButtonClick}
              disabled={!isEmailValid}
            >
              Далее
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
