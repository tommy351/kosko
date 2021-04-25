import React, { FunctionComponent } from "react";
import Select from "./Select";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import useEnvironmentList from "../../hooks/useEnvironmentList";

const EnvironmentSelect: FunctionComponent = () => {
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
};

export default EnvironmentSelect;
