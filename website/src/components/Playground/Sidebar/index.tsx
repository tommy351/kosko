import React, { FunctionComponent, useMemo } from "react";
import { usePlayground } from "../context";
import { ToolbarContainer, ToolbarTitle } from "../Toolbar";
import styles from "./styles.module.scss";
import generateEntries from "./generateEntries";
import Tree from "./Tree";

const Sidebar: FunctionComponent = () => {
  const {
    value: { files }
  } = usePlayground();
  const entries = useMemo(() => generateEntries(Object.keys(files)), [files]);

  return (
    <aside className={styles.container}>
      <ToolbarContainer>
        <ToolbarTitle>Files</ToolbarTitle>
      </ToolbarContainer>
      <div className={styles.treeContainer}>
        <Tree entries={entries} />
      </div>
    </aside>
  );
};

export default Sidebar;
