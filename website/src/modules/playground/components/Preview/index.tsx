import React, { FunctionComponent } from "react";
import styles from "./styles.module.scss";
import { ToolbarContainer, ToolbarTitle } from "../Toolbar";
import Content from "./Content";
import ComponentSelect from "./ComponentSelect";
import EnvironmentSelect from "./EnvironmentSelect";

const Preview: FunctionComponent = () => {
  return (
    <div className={styles.container}>
      <ToolbarContainer>
        <ToolbarTitle>Preview</ToolbarTitle>
        <ComponentSelect />
        <EnvironmentSelect />
      </ToolbarContainer>
      <Content />
    </div>
  );
};

export default Preview;
