import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ModuleItem } from '../data/mockData';

export type SubmitDraft = {
  module: ModuleItem | null;
  rating: number;
  comment: string;
};

const emptyDraft = (): SubmitDraft => ({
  module: null,
  rating: 0,
  comment: '',
});

type SubmitFeedbackContextValue = {
  draft: SubmitDraft;
  setModule: (m: ModuleItem) => void;
  setRating: (n: number) => void;
  setComment: (s: string) => void;
  reset: () => void;
};

const SubmitFeedbackContext = createContext<
  SubmitFeedbackContextValue | undefined
>(undefined);

export function SubmitFeedbackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [draft, setDraft] = useState<SubmitDraft>(emptyDraft);

  const setModule = useCallback((m: ModuleItem) => {
    setDraft(d => ({ ...d, module: m }));
  }, []);

  const setRating = useCallback((n: number) => {
    setDraft(d => ({ ...d, rating: n }));
  }, []);

  const setComment = useCallback((s: string) => {
    setDraft(d => ({ ...d, comment: s }));
  }, []);

  const reset = useCallback(() => {
    setDraft(emptyDraft());
  }, []);

  const value = useMemo(
    () => ({ draft, setModule, setRating, setComment, reset }),
    [draft, setModule, setRating, setComment, reset],
  );

  return (
    <SubmitFeedbackContext.Provider value={value}>
      {children}
    </SubmitFeedbackContext.Provider>
  );
}

export function useSubmitFeedback() {
  const ctx = useContext(SubmitFeedbackContext);
  if (!ctx) {
    throw new Error('useSubmitFeedback must be used within SubmitFeedbackProvider');
  }
  return ctx;
}
