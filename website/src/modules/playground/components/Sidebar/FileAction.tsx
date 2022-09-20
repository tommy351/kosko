import React from "react";
import { ActionButton, ActionContainer } from "./Action";
import { VscEdit, VscTrash } from "react-icons/vsc";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import { dirname, sep } from "@site/src/utils/path";
import { isValidName } from "./utils";

export default function FileAction({ path }: { path: string }) {
  const {
    value: { files },
    updateValue
  } = usePlaygroundContext();

  return (
    <ActionContainer>
      <ActionButton
        title="Rename"
        icon={<VscEdit />}
        onClick={() => {
          const name = prompt("New name of the file");
          if (!name) return;

          if (!isValidName(name)) {
            alert(`File name "${name}" is invalid`);
            return;
          }

          const dir = dirname(path);
          const newPath = `${dir}${dir.endsWith(sep) ? "" : sep}${name}.js`;
          if (path === newPath) return;

          if (files[newPath] != null) {
            alert(`File "${newPath}" already exists`);
            return;
          }

          updateValue((draft) => {
            draft.files[newPath] = draft.files[path];
            delete draft.files[path];

            if (draft.activePath === path) {
              draft.activePath = newPath;
            }
          });
        }}
      />
      <ActionButton
        title="Delete"
        icon={<VscTrash />}
        onClick={() => {
          if (!confirm("Are you sure to delete this file?")) {
            return;
          }

          updateValue((draft) => {
            if (draft.activePath === path) {
              draft.activePath = undefined;
            }

            delete draft.files[path];
          });
        }}
      />
    </ActionContainer>
  );
}
