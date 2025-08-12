import { create } from 'zustand';

interface Answer {
  questionId: string;
  answer: string;
}

interface TestState {
  currentTestId: string | null;
  answers: Answer[];
  startTest: (testId: string) => void;
  setAnswer: (questionId: string, answer: string) => void;
  resetTest: () => void;
}

export const useTestStore = create<TestState>()((set) => ({
  currentTestId: null,
  answers: [],

  startTest: (testId) => set({ currentTestId: testId, answers: [] }),

  setAnswer: (questionId, answer) =>
    set((state) => {
      const existingIndex = state.answers.findIndex((a) => a.questionId === questionId);
      if (existingIndex >= 0) {
        const updated = [...state.answers];
        updated[existingIndex] = { questionId, answer };
        return { answers: updated };
      }
      return { answers: [...state.answers, { questionId, answer }] };
    }),

  resetTest: () => set({ currentTestId: null, answers: [] }),
}));
