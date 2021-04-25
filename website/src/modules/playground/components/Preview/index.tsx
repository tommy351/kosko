import React, { FunctionComponent } from "react";
import styles from "./styles.module.scss";
import { ToolbarContainer, ToolbarTitle } from "../Toolbar";
import Content from "./Content";

const Preview: FunctionComponent = () => {
  return (
    <div className={styles.container}>
      <ToolbarContainer>
        <ToolbarTitle>Preview</ToolbarTitle>
      </ToolbarContainer>
      <Content />
    </div>
  );
};

export default Preview;
