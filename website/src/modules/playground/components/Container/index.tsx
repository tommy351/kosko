import React, {
  createContext,
  RefObject,
  createRef,
  useRef,
  useMemo,
  useContext
} from "react";
import {
  Container as ResizerContainer,
  ContainerProps
} from "react-simple-resizer";

const ContainerContext = createContext<{
  vertical: boolean;
  ref: RefObject<ResizerContainer>;
}>({
  vertical: false,
  ref: createRef()
});

export function useContainer() {
  return useContext(ContainerContext);
}

export default function Container({
  vertical = false,
  ...props
}: ContainerProps) {
  const ref = useRef<ResizerContainer>(null);
  const value = useMemo(() => ({ vertical, ref }), [vertical, ref]);

  return (
    <ContainerContext.Provider value={value}>
      <ResizerContainer {...props} ref={ref} vertical={vertical} />
    </ContainerContext.Provider>
  );
}
