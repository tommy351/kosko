export default function executeModule(code: string): HTMLScriptElement {
  const script = document.createElement("script");

  script.type = "module";
  script.innerHTML = code;

  document.body.appendChild(script);

  return script;
}
