import { FunctionComponent, useEffect, useMemo, useState } from "react";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import { usePreviewContext } from "./context";
import { createBundler } from "../../worker";
import { useDebounce } from "use-debounce";

const EVENT_SOURCE = "kosko-playground";
const EVENT_CALLBACK = "window.__postMessageToParent";

const FRAME_CONTENT = `
<script>
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
          name: "NetworkError",
          message: "Script load failed. Open the console for more details."
        }
      });
    });

    document.body.appendChild(script);
  });
</script>
`;

const Executor: FunctionComponent = () => {
  const {
    value: { mounted },
    updateValue
  } = usePreviewContext();
  const {
    value: { files: filesValue, component, environment }
  } = usePlaygroundContext();
  const [files] = useDebounce(filesValue, 300);
  const bundler = useMemo(() => createBundler(), []);
  const [frame, setFrame] = useState<HTMLIFrameElement | undefined>();

  // Create a iframe as a sandbox
  useEffect(() => {
    const frame = document.createElement("iframe");
    const blob = new Blob([FRAME_CONTENT], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    frame.src = url;
    frame.style.display = "none";

    document.body.appendChild(frame);
    setFrame(frame);

    return () => {
      setFrame(undefined);
      frame.remove();
      URL.revokeObjectURL(url);
    };
  }, []);

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
    if (!mounted || !frame) return;

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
        frame.contentWindow.postMessage({ code: result.code }, "*");
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
  }, [mounted, frame, files, component, environment]);

  return null;
};

export default Executor;
