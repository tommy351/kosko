import React from "react";
import { ActionButton, ActionContainer } from "./Action";
import { VscNewFolder, VscNewFile, VscEdit, VscTrash } from "react-icons/vsc";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import { dirname, sep } from "@site/src/utils/path";
import { DIRECTORY_PLACEHOLDER } from "../../constants";
import { isValidName } from "./utils";

export default function DirectoryAction({
  path,
  showFileActions
}: {
  path: string;
  showFileActions?: boolean;
}) {
  const {
    value: { files },
    updateValue
  } = usePlaygroundContext();

  return (
    <ActionContainer>
      <ActionButton
        title="New file"
        icon={<VscNewFile />}
        onClick={() => {
          const name = prompt("Name of new file");
          if (!name) return;

          if (!isValidName(name)) {
            alert(`File name "${name}" is invalid`);
            return;
          }

          const newPath = `${path}${sep}${name}.js`;

          if (files[newPath] != null) {
            alert(`File "${newPath}" already exists`);
            return;
          }

          updateValue((draft) => {
            draft.files[newPath] = "";
            draft.activePath = newPath;
          });
        }}
      />
      <ActionButton
        title="New folder"
        icon={<VscNewFolder />}
        onClick={() => {
          const name = prompt("Name of new folder");
          if (!name) return;

          if (!isValidName(name)) {
            alert(`Folder name "${name}" is invalid`);
            return;
          }

          const dir = `${path}${sep}${name}`;
          const newPath = `${dir}${sep}${DIRECTORY_PLACEHOLDER}`;

          if (files[newPath] != null) {
            alert(`Folder "${dir}" already exists`);
            return;
          }

          updateValue((draft) => {
            draft.files[newPath] = "";
          });
        }}
      />
      {showFileActions && (
        <>
          <ActionButton
            title="Rename"
            icon={<VscEdit />}
            onClick={() => {
              const name = prompt("New name of the folder");
              if (!name) return;

              if (!isValidName(name)) {
                alert(`Folder name "${name}" is invalid`);
                return;
              }

              const parentDir = dirname(path);
              const newDirPath = `${parentDir}${
                parentDir.endsWith(sep) ? "" : sep
              }${name}`;
              const newPlaceholderPath = `${newDirPath}${sep}${DIRECTORY_PLACEHOLDER}`;

              if (files[newPlaceholderPath] != null) {
                alert(`Folder "${newDirPath}" already exists`);
                return;
              }

              updateValue((draft) => {
                for (const key of Object.keys(draft.files)) {
                  if (!key.startsWith(`${path}${sep}`)) continue;

                  const newPath = `${newDirPath}${key.substring(path.length)}`;

                  if (draft.activePath === key) {
                    draft.activePath = newPath;
                  }

                  draft.files[newPath] = draft.files[key];
                  delete draft.files[key];
                }
              });
            }}
          />
          <ActionButton
            title="Delete"
            icon={<VscTrash />}
            onClick={() => {
              if (!confirm("Are you sure to delete this folder?")) {
                return;
              }

              updateValue((draft) => {
                const pathsToDelete = Object.keys(draft.files).filter((key) =>
                  key.startsWith(`${path}${sep}`)
                );

                if (pathsToDelete.includes(draft.activePath)) {
                  draft.activePath = undefined;
                }

                for (const path of pathsToDelete) {
                  delete draft.files[path];
                }
              });
            }}
          />
        </>
      )}
    </ActionContainer>
  );
}
