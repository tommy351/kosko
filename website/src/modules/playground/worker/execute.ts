type ExecuteCallback = (err?: unknown, content?: string) => void;
type Dispose = () => void;

export function execute(
  id: string,
  code: string,
  callback: ExecuteCallback
): Dispose {
  (window as any)[id] = callback;

  const script = document.createElement("script");

  script.type = "module";
  script.innerHTML = code;
  script.id = `${id}-script`;

  document.body.appendChild(script);

  return () => {
    delete (window as any)[id];
    script.remove();
  };
}
