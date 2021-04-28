import React, { FunctionComponent, useEffect, useMemo, useRef } from "react";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import { usePreviewContext } from "./context";
import { createBundler } from "../../worker";
import { useDebounce } from "use-debounce";

const EVENT_SOURCE = "kosko-playground";
const EVENT_CALLBACK = "window.__postMessageToParent";

const FRAME_CONTENT = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<script>
  (function(){
    "use strict";

    ${EVENT_CALLBACK} = (data) => {
      window.parent.postMessage(Object.assign({
        source: "${EVENT_SOURCE}"
      }, data));
    };

    window.addEventListener("error", event => {
      ${EVENT_CALLBACK}({
        type: "error",
        payload: {
          name: event.error.name,
          message: event.error.message,
          stack: event.error.stack
        }
      });
    });

    window.addEventListener("message", event => {
      const script = document.createElement("script");

      script.type = "module";
      script.innerHTML = event.data.code;

      script.addEventListener("error", () => {
        ${EVENT_CALLBACK}({
          type: "error",
          payload: {
            name: "Error",
            message: "Script load failed. Open the console for more details."
          }
        });
      });

      document.body.appendChild(script);
    });
  })();
</script>
</head>
`;

const Executor: FunctionComponent = () => {
  const { updateValue } = usePreviewContext();
  const {
    value: { files: filesValue, component, environment }
  } = usePlaygroundContext();
  const [files] = useDebounce(filesValue, 300);
  const bundler = useMemo(() => createBundler(), []);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const frameSrc = useMemo(() => {
    const blob = new Blob([FRAME_CONTENT], { type: "text/html" });
    return URL.createObjectURL(blob);
  }, []);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(frameSrc);
    };
  }, [frameSrc]);

  // Handle iframe messages
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data.source !== EVENT_SOURCE) return;

      updateValue((draft) => {
        draft.updating = false;

        switch (event.data.type) {
          case "success":
            draft.content = event.data.payload;
            break;
          case "error":
            draft.errors.push(event.data.payload);
            break;
        }
      });
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (!frameRef.current) return;

    let canceled = false;

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
        const result = await bundler.bundle({
          files,
          component,
          environment,
          callback: EVENT_CALLBACK
        });

        if (canceled) return;

        update((draft) => {
          draft.warnings.push(...result.warnings);
        });

        // Send data to iframe
        frameRef.current.contentWindow.postMessage({ code: result.code }, "*");
      } catch (err) {
        update((draft) => {
          draft.updating = false;
          draft.errors.push(err);
        });
      }
    })();

    return () => {
      canceled = true;
    };
  }, [frameRef, files, component, environment]);

  return <iframe ref={frameRef} style={{ display: "none" }} src={frameSrc} />;
};

export default Executor;
