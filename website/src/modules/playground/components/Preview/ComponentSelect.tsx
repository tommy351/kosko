import React from "react";
import Select from "./Select";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import useComponentList from "../../hooks/useComponentList";

export default function ComponentSelect() {
  const {
    value: { component },
    updateValue
  } = usePlaygroundContext();
  const components = useComponentList();

  return (
    <Select
      label="Component"
      value={component}
      options={components}
      onChange={(value) => {
        updateValue((draft) => {
          draft.component = value;
        });
      }}
    />
  );
}
