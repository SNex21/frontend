interface User {
  id: number;
  username: string;
  telegramId?: number;
  avatarUrl?: string;
  create_datetime: Date;
  subscription: SubscriptionInf | null;
  mistake: boolean;
  settings: {
    notifications: boolean;
  };
}

interface SubscriptionInf {
  start_date: string;
  end_date: string;
  plan: number;
  price: number;
  type: string;
}

interface UserStats {
  streak: number;
  total_tasks: number;
  accuracy: number;
}

export { type User, type UserStats };
