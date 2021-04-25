type ExecuteCallback = (err?: unknown, content?: string) => void;
type Dispose = () => void;

const CATCH_GLOBAL_ERROR = `
<script>
  window.addEventListener("error", (event) => {
    window.parent.postMessage({
      source: "kosko-playground",
      type: "error",
      payload: event.error
    });
  });
</script>
`;

export function execute(code: string, callback: ExecuteCallback): Dispose {
  function handleMessage(event: MessageEvent) {
    if (event.data.source !== "kosko-playground") {
      return;
    }

    switch (event.data.type) {
      case "success":
        callback(null, event.data.payload);
        return;

      case "error":
        callback(event.data.payload);
        return;
    }
  }

  window.addEventListener("message", handleMessage);

  const frame = document.createElement("iframe");
  const blob = new Blob(
    [CATCH_GLOBAL_ERROR, `<script type="module">${code}</script>`],
    {
      type: "text/html"
    }
  );
  const url = URL.createObjectURL(blob);

  frame.width = "0";
  frame.height = "0";
  frame.src = url;
  frame.style.display = "none";

  document.body.appendChild(frame);

  return () => {
    window.removeEventListener("message", handleMessage);
    frame.remove();
    URL.revokeObjectURL(url);
  };
}
