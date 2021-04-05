import { IRawThemeSetting, IRawGrammar, IRawTheme } from 'vscode-textmate';

declare type Theme = 'dark-plus' | 'github-dark' | 'github-light' | 'light-plus' | 'material-theme-darker' | 'material-theme-default' | 'material-theme-lighter' | 'material-theme-ocean' | 'material-theme-palenight' | 'min-dark' | 'min-light' | 'monokai' | 'nord' | 'slack-theme-dark-mode' | 'slack-theme-ochin' | 'solarized-dark' | 'solarized-light';
declare const themes: string[];

interface IThemedTokenScopeExplanation {
    scopeName: string;
    themeMatches: IRawThemeSetting[];
}
interface IThemedTokenExplanation {
    content: string;
    scopes: IThemedTokenScopeExplanation[];
}
/**
 * A single token with color, and optionally with explanation.
 *
 * For example:
 *
 * {
 *   "content": "shiki",
 *   "color": "#D8DEE9",
 *   "explanation": [
 *     {
 *       "content": "shiki",
 *       "scopes": [
 *         {
 *           "scopeName": "source.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.objectliteral.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.object.member.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.array.literal.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "variable.other.object.js",
 *           "themeMatches": [
 *             {
 *               "name": "Variable",
 *               "scope": "variable.other",
 *               "settings": {
 *                 "foreground": "#D8DEE9"
 *               }
 *             },
 *             {
 *               "name": "[JavaScript] Variable Other Object",
 *               "scope": "source.js variable.other.object",
 *               "settings": {
 *                 "foreground": "#D8DEE9"
 *               }
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 *
 */
interface IThemedToken {
    /**
     * The content of the token
     */
    content: string;
    /**
     * 6 or 8 digit hex code representation of the token's color
     */
    color?: string;
    /**
     * Explanation of
     *
     * - token text's matching scopes
     * - reason that token text is given a color (one matching scope matches a rule (scope -> color) in the theme)
     */
    explanation?: IThemedTokenExplanation[];
}

interface HighlighterOptions {
    theme?: IThemeRegistration;
    langs?: (Lang | ILanguageRegistration)[];
    themes?: IThemeRegistration[];
    /**
     * Paths for loading themes and langs. Relative to the package's root.
     */
    paths?: IHighlighterPaths;
}
interface Highlighter {
    codeToThemedTokens(code: string, lang?: StringLiteralUnion<Lang>, theme?: StringLiteralUnion<Theme>, options?: ThemedTokenizerOptions): IThemedToken[][];
    codeToHtml(code: string, lang?: StringLiteralUnion<Lang>, theme?: StringLiteralUnion<Theme>): string;
    loadTheme(theme: IThemeRegistration): Promise<void>;
    loadLanguage(theme: ILanguageRegistration | Lang): Promise<void>;
    getForegroundColor(theme?: StringLiteralUnion<Theme>): string;
    getBackgroundColor(theme?: StringLiteralUnion<Theme>): string;
}
interface IHighlighterPaths {
    /**
     * @default 'themes/'
     */
    themes?: string;
    /**
     * @default 'languages/'
     */
    languages?: string;
}
declare type ILanguageRegistration = {
    id: string;
    scopeName: string;
    aliases?: string[];
} & ({
    path: string;
    grammar?: IRawGrammar;
} | {
    path?: string;
    grammar: IRawGrammar;
});
declare type IThemeRegistration = IShikiTheme | StringLiteralUnion<Theme>;
interface IShikiTheme extends IRawTheme {
    /**
     * @description theme name
     */
    name?: string;
    /**
     * tokenColors of the theme file
     */
    settings: IRawThemeSetting[];
    /**
     * @description text default foreground color
     */
    fg: string;
    /**
     * @description text default background color
     */
    bg: string;
    /**
     * @description relative path of included theme
     */
    include?: string;
}
/**
 * Adapted from https://github.com/microsoft/TypeScript/issues/29729
 * Since `string | 'foo'` doesn't offer auto completion
 */
declare type StringLiteralUnion<T extends U, U = string> = T | (U & {});
interface ThemedTokenizerOptions {
    /**
     * Whether to include explanation of each token's matching scopes
     * and why it's given its color. Default to false.
     */
    includeExplanation?: boolean;
}

declare type Lang = 'abap' | 'actionscript-3' | 'ada' | 'apex' | 'applescript' | 'asm' | 'asp-net-razor' | 'awk' | 'bat' | 'c' | 'clojure' | 'cobol' | 'coffee' | 'cpp' | 'crystal' | 'csharp' | 'css' | 'd' | 'dart' | 'diff' | 'dockerfile' | 'elixir' | 'elm' | 'erlang' | 'fsharp' | 'git-commit' | 'git-rebase' | 'go' | 'graphql' | 'groovy' | 'hack' | 'haml' | 'handlebars' | 'haskell' | 'hcl' | 'hlsl' | 'html-ruby-erb' | 'html' | 'ini' | 'java' | 'javascript' | 'jinja-html' | 'json' | 'jsonc' | 'jsonnet' | 'jsx' | 'julia' | 'kotlin' | 'latex' | 'less' | 'lisp' | 'logo' | 'lua' | 'makefile' | 'markdown' | 'matlab' | 'nix' | 'objective-c' | 'ocaml' | 'pascal' | 'perl' | 'perl6' | 'php' | 'pls' | 'postcss' | 'powershell' | 'prolog' | 'pug' | 'puppet' | 'purescript' | 'python' | 'r' | 'razor' | 'ruby' | 'rust' | 'sas' | 'sass' | 'scala' | 'scheme' | 'scss' | 'shaderlab' | 'shellscript' | 'smalltalk' | 'sql' | 'ssh-config' | 'stylus' | 'swift' | 'tcl' | 'toml' | 'ts' | 'tsx' | 'typescript' | 'vb' | 'viml' | 'vue' | 'wasm' | 'xml' | 'xsl' | 'yaml' | '文言';
declare const languages: ILanguageRegistration[];

declare function getHighlighter(options: HighlighterOptions): Promise<Highlighter>;

interface HtmlRendererOptions {
    langId?: string;
    fg?: string;
    bg?: string;
}
declare function renderToHtml(lines: IThemedToken[][], options?: HtmlRendererOptions): string;

/**
 * Set the route for loading the assets
 * URL should end with `/`
 *
 * For example:
 * ```ts
 * setCDN('https://unpkg.com/shiki/') // use unpkg
 * setCDN('/assets/shiki/') // serve by yourself
 * ```
 */
declare function setCDN(root: string): void;
/**
 * Explicitly set the source for loading the OnigasmWASM
 *
 * Accepts Url or ArrayBuffer
 */
declare function setOnigasmWASM(path: string | ArrayBuffer): void;
/**
 * @param themePath related path to theme.json
 */
declare function fetchTheme(themePath: string): Promise<IShikiTheme>;

export { languages as BUNDLED_LANGUAGES, themes as BUNDLED_THEMES, Highlighter, HighlighterOptions, HtmlRendererOptions, ILanguageRegistration, IShikiTheme, IThemeRegistration, IThemedToken, Lang, Theme, getHighlighter, fetchTheme as loadTheme, renderToHtml, setCDN, setOnigasmWASM };
