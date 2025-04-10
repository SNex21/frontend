// Удалить строку импорта Choice
// import { Choice } from "@/models/Session.ts"; // Удалить эту строку

import React, { ReactNode } from "react";
import { ChallengeScreenProps, ChallengeState } from "@/pages/(authenticated)/lesson/Challenge/Challenge.tsx";
import { ChallengeSubmit } from "@/pages/(authenticated)/lesson/Challenge/layout/ChallengeSubmit.tsx";
import { ChallengeHeading } from "@/pages/(authenticated)/lesson/Challenge/layout/ChallengeHeading.tsx";
import { ChallengeMain } from "@/pages/(authenticated)/lesson/Challenge/layout/ChallengeMain.tsx";
import { useHapticFeedback } from "@/lib/twa/hooks";
import { ChoicesPunctuation } from "@/pages/(authenticated)/lesson/Challenge/shared/Choices/ChoicesPunctuation.tsx";

const PunctuationChallenge: React.FC<ChallengeScreenProps> = ({ challenge, updateStats, next }) => {
  const [, notification] = useHapticFeedback();
  const [state, setState] = React.useState<ChallengeState>({ submitted: false, wrong: false });
  const [selectedIndexes, setSelectedIndexes] = React.useState<Set<number>>(new Set()); // Множество выбранных индексов
  const [correctAnswerIds, setCorrectAnswerIds] = React.useState<number[] | null>(null);

  // Функция для изменения выбора
  const toggleChoice = (index: number) => {
    setSelectedIndexes((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(index)) {
        newSelected.delete(index);
      } else {
        newSelected.add(index);
      }
      return newSelected;
    });
  };

  function onSubmit() {
    if (selectedIndexes.size === 0) {
      return;
    }

    // Проверяем, что choices существует
    if (!challenge.choices) {
      console.error("Choices are undefined");
      return;
    }

    const correctIds = challenge.choices
      .map((c, i) => c.isCorrect ? i : -1)
      .filter((index) => index !== -1); // Массив правильных индексов

    setCorrectAnswerIds(correctIds);

    const selectedIds = Array.from(selectedIndexes);

    const isCorrect = selectedIds.every((id) => correctIds.includes(id)) && selectedIds.length === correctIds.length;

    setState({
      submitted: true,
      wrong: !isCorrect,
    });

    updateStats(isCorrect);
    notification(isCorrect ? "success" : "error");
  }

  const prompt = challenge.prompt ?? '';

  return (
    <>
      <ChallengeHeading challenge={challenge}>Расставьте запятые</ChallengeHeading>
      <ChallengeMain>
        {formatPrompt(
          prompt,
          <ChoicesPunctuation
            choices={challenge.choices}
            state={state}
            correctAnswerIds={correctAnswerIds} // Передаем правильные ответы
            selectedIndexes={selectedIndexes} // Передаем выбранные индексы
            toggleChoice={toggleChoice} // Передаем функцию изменения выбора
          />,
        )}
      </ChallengeMain>
      <ChallengeSubmit
        onSubmit={onSubmit}
        challenge={challenge}
        next={next}
        disabled={selectedIndexes.size === 0} // Кнопка доступна только при выборе хотя бы одного варианта
        state={state}
        correctText={''} // убираем из сабмита правильное слово
        explanation={challenge.explanation}
      />
    </>
  );
};

function formatPrompt(prompt: string, GapFillComponent: ReactNode): ReactNode {
  // Разбиваем строку по маркеру {task_text}
  const parts = prompt.split('{task_text}');

  // Возвращаем отформатированный JSX
  return (
    <>
      <h3>{parts[0] && <span>{parts[0].trim()}</span>}</h3>
      {GapFillComponent}
      <h3>{parts[1] && <span>{parts[1].trim()}</span>}</h3>
    </>
  );
}

export { PunctuationChallenge };
