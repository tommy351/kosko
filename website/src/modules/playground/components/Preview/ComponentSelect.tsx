import React, { FunctionComponent } from "react";
import Select from "./Select";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import useComponentList from "../../hooks/useComponentList";

const ComponentSelect: FunctionComponent = () => {
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
};

export default ComponentSelect;
