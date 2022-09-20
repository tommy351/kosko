import React, { useMemo } from "react";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import { ToolbarContainer, ToolbarTitle } from "../Toolbar";
import styles from "./styles.module.scss";
import generateEntries from "./generateEntries";
import Tree from "./Tree";
import DirectoryAction from "./DirectoryAction";

export default function Sidebar() {
  const {
    value: { files }
  } = usePlaygroundContext();
  const entries = useMemo(() => generateEntries(Object.keys(files)), [files]);

  return (
    <aside className={styles.container}>
      <ToolbarContainer>
        <ToolbarTitle>Files</ToolbarTitle>
        <div className={styles.toolbarSpacing} />
        <DirectoryAction path="" />
      </ToolbarContainer>
      <div className={styles.treeContainer}>
        <div className={styles.tree}>
          <Tree entries={entries} />
        </div>
      </div>
    </aside>
  );
}
