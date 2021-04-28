import { Draft } from "immer";
import { noop } from "lodash";
import React, {
  createContext,
  FunctionComponent,
  useContext,
  useMemo
} from "react";
import { useImmer } from "use-immer";

export interface PreviewContextValue {
  updating: boolean;
  content: string;
  warnings: string[];
  errors?: any[];
}

export const PreviewContext = createContext<{
  value: PreviewContextValue;
  updateValue(callback: (draft: Draft<PreviewContextValue>) => void): void;
}>({
  value: {
    updating: false,
    content: "",
    warnings: [],
    errors: []
  },
  updateValue: noop
});

export function usePreviewContext() {
  return useContext(PreviewContext);
}

export const PreviewContextProvider: FunctionComponent = ({ children }) => {
  const [value, updateValue] = useImmer<PreviewContextValue>({
    updating: false,
    content: "",
    warnings: [],
    errors: []
  });
  const ctx = useMemo(() => ({ value, updateValue }), [value, updateValue]);

  return (
    <PreviewContext.Provider value={ctx}>{children}</PreviewContext.Provider>
  );
};
