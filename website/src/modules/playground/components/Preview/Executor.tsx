import { FunctionComponent, useEffect, useMemo } from "react";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import { usePreviewContext } from "./context";
import { createPlaygroundWorker, execute } from "../../worker";
import { noop } from "lodash";
import { useDebounce } from "use-debounce";

let CALLBACK_ID = 0;

const Executor: FunctionComponent = () => {
  const {
    value: { mounted },
    updateValue
  } = usePreviewContext();
  const {
    value: { files: filesValue, component, environment }
  } = usePlaygroundContext();
  const [files] = useDebounce(filesValue, 300);
  const worker = useMemo(() => createPlaygroundWorker(), []);

  useEffect(() => {
    if (!mounted) return;

    const callbackId = `__koskoPlayground_${CALLBACK_ID++}`;
    let canceled = false;
    let dispose = noop;

    const update: typeof updateValue = (callback) => {
      if (canceled) return;

      updateValue(callback);
    };

    (async () => {
      // Reset state
      update((draft) => {
        draft.updating = true;
        draft.errors = [];
        draft.warnings = [];
      });

      try {
        const result = await worker.bundle({
          files,
          component,
          environment,
          callback: `window.${callbackId}`
        });

        if (canceled) return;

        update((draft) => {
          draft.warnings.push(...result.warnings);
        });

        dispose = execute(callbackId, result.code, (err, code) => {
          update((draft) => {
            draft.updating = false;

            if (err) {
              draft.errors.push(err);
            } else {
              draft.content = code;
            }
          });
        });
      } catch (err) {
        update((draft) => {
          draft.updating = false;
          draft.errors.push(err);
        });
      }
    })();

    return () => {
      canceled = true;
      dispose();
    };
  }, [mounted, files, component, environment]);

  return null;
};

export default Executor;
