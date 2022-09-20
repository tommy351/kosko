import { useEffect, useMemo, useState } from "react";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import { usePreviewContext } from "./context";
import { createBundler } from "../../worker";
import { useDebounce } from "use-debounce";

const EVENT_SOURCE = "kosko-playground";
const EVENT_CALLBACK = "window.__postMessageToParent";

let EVENT_ID = 0;

export default function Executor() {
  const { updateValue } = usePreviewContext();
  const {
    value: { files: filesValue, component, environment }
  } = usePlaygroundContext();
  const [files] = useDebounce(filesValue, 300);
  const bundler = useMemo(() => createBundler(), []);
  const [frame, setFrame] = useState<HTMLIFrameElement | undefined>(undefined);
  const [frameLoaded, setFrameLoaded] = useState(false);

  // Create an iframe
  useEffect(() => {
    const element = document.createElement("iframe");
    const blob = new Blob(
      [
        `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<script>
(function(){
  "use strict";

  let currentId = -1;

  ${EVENT_CALLBACK} = (id, data) => {
    if (id !== currentId) return;

    window.parent.postMessage(Object.assign({
      source: "${EVENT_SOURCE}"
    }, data));
  };

  window.addEventListener("error", event => {
    ${EVENT_CALLBACK}(currentId, {
      type: "error",
      payload: {
        name: event.error.name,
        message: event.error.message,
        stack: event.error.stack
      }
    });
  });

  window.addEventListener("message", event => {
    if (event.origin !== "${location.origin}") return;

    currentId = event.data.id;

    const script = document.createElement("script");

    script.type = "module";
    script.innerHTML = event.data.code;

    script.addEventListener("error", () => {
      ${EVENT_CALLBACK}(currentId, {
        type: "error",
        payload: {
          name: "Error",
          message: "Script load failed. Open the console for more details."
        }
      });
    });

    document.body.appendChild(script);
  }, false);
})();
</script>
</head>
</html>`
      ],
      { type: "text/html" }
    );
    const src = URL.createObjectURL(blob);

    element.style.display = "none";
    element.src = src;

    document.body.appendChild(element);
    setFrame(element);

    return () => {
      setFrame(undefined);
      element.remove();
      URL.revokeObjectURL(src);
    };
  }, []);

  // Detect if iframe is loaded
  useEffect(() => {
    if (!frame) return;

    function handleLoad() {
      setFrameLoaded(true);
    }

    frame.addEventListener("load", handleLoad);

    return () => {
      frame.removeEventListener("load", handleLoad);
      setFrameLoaded(false);
    };
  }, [frame]);

  // Handle iframe messages
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== location.origin) return;
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

    window.addEventListener("message", handleMessage, false);

    return () => {
      window.removeEventListener("message", handleMessage, false);
    };
  }, []);

  useEffect(() => {
    if (!frame || !frameLoaded) return;

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
        const id = EVENT_ID++;
        const result = await bundler.bundle({
          files,
          component,
          environment,
          callback: `${EVENT_CALLBACK}.bind(null, ${id})`
        });

        if (canceled) return;

        update((draft) => {
          draft.warnings.push(...result.warnings);
        });

        // Send data to iframe
        frame.contentWindow.postMessage({ code: result.code, id }, "*");
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
  }, [frame, frameLoaded, files, component, environment]);

  return null;
}
