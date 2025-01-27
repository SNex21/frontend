export default function LessonPage() {
  const params = useParams();
  const cloudStorage = useCloudStorage();

  const [completed, setCompleted] = React.useState(false);
  const [startDate, setStartDate] = React.useState<number | null>(null);
  const [stats, setStats] = React.useState(defaultStats);

  const { data: session, isLoading, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () =>
      getTasks({
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
        topic_id: params.topicId ? Number(params.topicId) : undefined,
        isHard: params["*"] === "hard",
        isWorkOnMistakes: params["*"] === "mistakes",
      }),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });

  const restartSession = React.useCallback(() => {
    setCompleted(false); // Сбросить состояние завершения
    setStartDate(new Date().getTime()); // Установить новое время начала
    setStats(defaultStats); // Сбросить статистику
    refetch(); // Повторно запросить данные
  }, [refetch]);

  React.useEffect(() => {
    if (!startDate) {
      setStartDate(new Date().getTime());
    }
  }, [startDate]);

  React.useEffect(() => {
    if (
      session?.amount &&
      stats.total === 0 &&
      stats.completed === 0 &&
      stats.correct === 0 &&
      stats.index === 1
    ) {
      setStats({ total: session.amount, completed: 0, correct: 0, index: 1 });
    }
  }, [session?.amount, stats]);

  const correctPercentage = React.useMemo(
    () => Math.round((stats.correct / stats.total) * 100),
    [stats]
  );

  return (
    <AnimatePresence>
      {isLoading && <LessonPageLoading initial key="loading" />}
      {session && !completed && (
        <SessionBuilder
          key="session"
          session={session}
          stats={stats}
          setStats={setStats}
          onComplete={async ({ guesses }) => {
            if (session && startDate) {
              try {
                await completeSession({
                  token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
                  id: session.id,
                  wastedTime: new Date().getTime() - startDate,
                  guesses,
                });
              } catch (e) {
                console.error(e);
              }
            }
            setCompleted(true);
          }}
          startDate={startDate ?? Date.now()}
        />
      )}
      {completed && (
        <LessonComplete
          startDate={startDate ?? Date.now()}
          correctPercentage={correctPercentage}
          onRestart={restartSession} // Передаем функцию перезапуска
        />
      )}
    </AnimatePresence>
  );
}
