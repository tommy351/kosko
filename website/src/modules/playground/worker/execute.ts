type ExecuteCallback = (err?: unknown, content?: string) => void;
type Dispose = () => void;

export function execute(
  id: string,
  code: string,
  callback: ExecuteCallback
): Dispose {
  function handleError(event: ErrorEvent) {
    callback(event.error);
  }

  (window as any)[id] = (event) => {
    if (event.source !== "kosko-playground") {
      return;
    }

    switch (event.type) {
      case "success":
        callback(null, event.payload);
        return;

      case "error":
        callback(event.payload);
        return;
    }
  };

  window.addEventListener("error", handleError);

  const script = document.createElement("script");

  script.type = "module";
  script.id = `${id}-script`;
  script.innerHTML = code;

  script.addEventListener("error", () => {
    callback({
      name: "NetworkError",
      message: "Script load failed. Open the console for more details."
    });
  });

  document.body.appendChild(script);

  return () => {
    delete (window as any)[id];
    window.removeEventListener("error", handleError);
    script.remove();
  };
}
