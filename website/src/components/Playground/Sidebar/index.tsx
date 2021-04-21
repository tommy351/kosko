import React, { FunctionComponent, useMemo } from "react";
import { usePlayground } from "../context";
import styles from "./styles.module.scss";
import Tree from "./Tree";

const Sidebar: FunctionComponent = () => {
  const {
    value: { files }
  } = usePlayground();
  const fileNames = useMemo(() => Object.keys(files), [files]);

  return (
    <aside className={styles.container}>
      <Tree files={fileNames} />
    </aside>
  );
};

export default Sidebar;
