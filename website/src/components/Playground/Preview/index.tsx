import React, { FunctionComponent } from "react";
import { usePlayground } from "../context";
import styles from "./styles.module.scss";
import { ToolbarContainer, ToolbarTitle } from "../Toolbar";
import Content from "./Content";
import useComponentList from "../hooks/useComponentList";
import useEnvironmentList from "../hooks/useEnvironmentList";
import Select from "./Select";

const ComponentSelect: FunctionComponent = () => {
  const components = useComponentList();
  const {
    value: { component },
    updateValue
  } = usePlayground();

  return (
    <Select
      label="Component"
      options={components}
      value={component}
      onChange={(value) => {
        updateValue((draft) => {
          draft.component = value;
        });
      }}
    />
  );
};

const EnvironmentSelect: FunctionComponent = () => {
  const environments = useEnvironmentList();
  const {
    value: { environment },
    updateValue
  } = usePlayground();

  return (
    <Select
      label="Environment"
      options={environments}
      value={environment}
      onChange={(value) => {
        updateValue((draft) => {
          draft.environment = value;
        });
      }}
    />
  );
};

const Preview: FunctionComponent = () => {
  const {
    value: { editorMounted }
  } = usePlayground();

  return (
    <div className={styles.container}>
      <ToolbarContainer>
        <ToolbarTitle>Preview</ToolbarTitle>
        <ComponentSelect />
        <EnvironmentSelect />
      </ToolbarContainer>
      {editorMounted && <Content />}
    </div>
  );
};

export default Preview;
