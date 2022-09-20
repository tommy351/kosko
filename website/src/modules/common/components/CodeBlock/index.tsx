import React, { useMemo } from "react";
import clsx from "clsx";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import styles from "./styles.module.scss";
import { usePrismTheme } from "@docusaurus/theme-common";

export interface StyleObj {
  [key: string]: string | number | null;
}

export interface Token {
  types: string[];
  content: string;
  empty?: boolean;
}

export interface TokenInputProps {
  key?: React.Key;
  style?: StyleObj;
  className?: string;
  token: Token;
  [otherProp: string]: unknown;
}

export interface TokenOutputProps {
  key?: React.Key;
  style?: StyleObj;
  className: string;
  children: string;
  [otherProp: string]: unknown;
}

export interface TokenRendererProps extends TokenInputProps {
  getTokenProps(input: TokenInputProps): TokenOutputProps;
}

export type TokenRenderer = (props: TokenRendererProps) => JSX.Element;

export const defaultTokenRenderer: TokenRenderer = ({
  key,
  getTokenProps,
  ...props
}) => {
  return <span key={key} {...getTokenProps({ key, ...props })} />;
};

export interface CodeBlockProps {
  code: string;
  language: Language;
  highlightLines?: number[];
  hideLines?: number[];
  className?: string;
  tokenRenderer?: TokenRenderer;
  trimStart?: boolean;
  trimEnd?: boolean;
}

export default function CodeBlock({
  language,
  highlightLines = [],
  hideLines = [],
  code,
  className: containerClassName,
  tokenRenderer = defaultTokenRenderer,
  trimStart = true,
  trimEnd = true
}: CodeBlockProps) {
  const prismTheme = usePrismTheme();
  const trimmedCode = useMemo(() => {
    let result = code;
    if (trimStart) result = code.trimStart();
    if (trimEnd) result = code.trimEnd();
    return result;
  }, [code, trimStart, trimEnd]);

  return (
    <Highlight
      {...defaultProps}
      theme={prismTheme}
      code={trimmedCode}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className={clsx(className, styles.container, containerClassName)}>
          <div className={styles.lines} style={style}>
            {tokens.map((line, i) => {
              if (hideLines.includes(i + 1)) return null;

              const highlighted = highlightLines.includes(i + 1);
              const lineProps = getLineProps({
                line,
                key: i,
                className: clsx(styles.line, {
                  [styles.lineHighlighted]: highlighted,
                  [styles.lineDimmed]: highlightLines.length && !highlighted
                })
              });

              return (
                <div key={i} {...lineProps}>
                  {line.map((token, key) =>
                    tokenRenderer({ token, key, getTokenProps })
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Highlight>
  );
}
