import React from "react";
import Select from "./Select";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import useEnvironmentList from "../../hooks/useEnvironmentList";

export default function EnvironmentSelect() {
  const {
    value: { environment },
    updateValue
  } = usePlaygroundContext();
  const environments = useEnvironmentList();

  return (
    <Select
      label="Environment"
      value={environment}
      options={environments}
      onChange={(value) => {
        updateValue((draft) => {
          draft.environment = value;
        });
      }}
    />
  );
}
