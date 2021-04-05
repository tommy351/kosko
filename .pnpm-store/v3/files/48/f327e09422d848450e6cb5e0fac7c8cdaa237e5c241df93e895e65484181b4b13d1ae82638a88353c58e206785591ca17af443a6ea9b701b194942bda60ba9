import { loadWASM, OnigScanner, OnigString } from 'onigasm';
import { Registry as Registry$1 } from 'vscode-textmate';

const themes = [
    'dark-plus',
    'github-dark',
    'github-light',
    'light-plus',
    'material-theme-darker',
    'material-theme-default',
    'material-theme-lighter',
    'material-theme-ocean',
    'material-theme-palenight',
    'min-dark',
    'min-light',
    'monokai',
    'nord',
    'slack-theme-dark-mode',
    'slack-theme-ochin',
    'solarized-dark',
    'solarized-light'
];

const languages = [
    {
        id: 'abap',
        scopeName: 'source.abap',
        path: 'abap.tmLanguage.json'
    },
    {
        id: 'actionscript-3',
        scopeName: 'source.actionscript.3',
        path: 'actionscript-3.tmLanguage.json'
    },
    {
        id: 'ada',
        scopeName: 'source.ada',
        path: 'ada.tmLanguage.json'
    },
    {
        id: 'apex',
        scopeName: 'source.apex',
        path: 'apex.tmLanguage.json'
    },
    {
        id: 'applescript',
        scopeName: 'source.applescript',
        path: 'applescript.tmLanguage.json'
    },
    {
        id: 'asm',
        scopeName: 'source.asm.x86_64',
        path: 'asm.tmLanguage.json'
    },
    {
        id: 'asp-net-razor',
        scopeName: 'text.aspnetcorerazor',
        path: 'asp-net-razor.tmLanguage.json'
    },
    {
        id: 'awk',
        scopeName: 'source.awk',
        path: 'awk.tmLanguage.json'
    },
    {
        id: 'bat',
        scopeName: 'source.batchfile',
        path: 'bat.tmLanguage.json',
        aliases: ['batch']
    },
    {
        id: 'c',
        scopeName: 'source.c',
        path: 'c.tmLanguage.json'
    },
    {
        id: 'clojure',
        scopeName: 'source.clojure',
        path: 'clojure.tmLanguage.json',
        aliases: ['clj']
    },
    {
        id: 'cobol',
        scopeName: 'source.cobol',
        path: 'cobol.tmLanguage.json'
    },
    {
        id: 'coffee',
        scopeName: 'source.coffee',
        path: 'coffee.tmLanguage.json'
    },
    {
        id: 'cpp',
        scopeName: 'source.cpp.embedded.macro',
        path: 'cpp.tmLanguage.json'
    },
    {
        id: 'crystal',
        scopeName: 'source.crystal',
        path: 'crystal.tmLanguage.json'
    },
    {
        id: 'csharp',
        scopeName: 'source.cs',
        path: 'csharp.tmLanguage.json',
        aliases: ['c#']
    },
    {
        id: 'css',
        scopeName: 'source.css',
        path: 'css.tmLanguage.json'
    },
    {
        id: 'd',
        scopeName: 'source.d',
        path: 'd.tmLanguage.json'
    },
    {
        id: 'dart',
        scopeName: 'source.dart',
        path: 'dart.tmLanguage.json'
    },
    {
        id: 'diff',
        scopeName: 'source.diff',
        path: 'diff.tmLanguage.json'
    },
    {
        id: 'dockerfile',
        scopeName: 'source.dockerfile',
        path: 'dockerfile.tmLanguage.json'
    },
    {
        id: 'elixir',
        scopeName: 'source.elixir',
        path: 'elixir.tmLanguage.json'
    },
    {
        id: 'elm',
        scopeName: 'source.elm',
        path: 'elm.tmLanguage.json'
    },
    {
        id: 'erlang',
        scopeName: 'source.erlang',
        path: 'erlang.tmLanguage.json'
    },
    {
        id: 'fsharp',
        scopeName: 'source.fsharp',
        path: 'fsharp.tmLanguage.json',
        aliases: ['f#']
    },
    {
        id: 'git-commit',
        scopeName: 'text.git-commit',
        path: 'git-commit.tmLanguage.json'
    },
    {
        id: 'git-rebase',
        scopeName: 'text.git-rebase',
        path: 'git-rebase.tmLanguage.json'
    },
    {
        id: 'go',
        scopeName: 'source.go',
        path: 'go.tmLanguage.json'
    },
    {
        id: 'graphql',
        scopeName: 'source.graphql',
        path: 'graphql.tmLanguage.json'
    },
    {
        id: 'groovy',
        scopeName: 'source.groovy',
        path: 'groovy.tmLanguage.json'
    },
    {
        id: 'hack',
        scopeName: 'source.hack',
        path: 'hack.tmLanguage.json'
    },
    {
        id: 'haml',
        scopeName: 'text.haml',
        path: 'haml.tmLanguage.json'
    },
    {
        id: 'handlebars',
        scopeName: 'text.html.handlebars',
        path: 'handlebars.tmLanguage.json',
        aliases: ['hbs']
    },
    {
        id: 'haskell',
        scopeName: 'source.haskell',
        path: 'haskell.tmLanguage.json'
    },
    {
        id: 'hcl',
        scopeName: 'source.hcl',
        path: 'hcl.tmLanguage.json'
    },
    {
        id: 'hlsl',
        scopeName: 'source.hlsl',
        path: 'hlsl.tmLanguage.json'
    },
    {
        id: 'html-ruby-erb',
        scopeName: 'text.html.erb',
        path: 'html-ruby-erb.tmLanguage.json',
        aliases: ['erb']
    },
    {
        id: 'html',
        scopeName: 'text.html.basic',
        path: 'html.tmLanguage.json'
    },
    {
        id: 'ini',
        scopeName: 'source.ini',
        path: 'ini.tmLanguage.json'
    },
    {
        id: 'java',
        scopeName: 'source.java',
        path: 'java.tmLanguage.json'
    },
    {
        id: 'javascript',
        scopeName: 'source.js',
        path: 'javascript.tmLanguage.json',
        aliases: ['js']
    },
    {
        id: 'jinja-html',
        scopeName: 'text.html.jinja',
        path: 'jinja-html.tmLanguage.json'
    },
    {
        id: 'jinja',
        scopeName: 'source.jinja',
        path: 'jinja.tmLanguage.json'
    },
    {
        id: 'json',
        scopeName: 'source.json',
        path: 'json.tmLanguage.json'
    },
    {
        id: 'jsonc',
        scopeName: 'source.json.comments',
        path: 'jsonc.tmLanguage.json'
    },
    {
        id: 'jsonnet',
        scopeName: 'source.jsonnet',
        path: 'jsonnet.tmLanguage.json'
    },
    {
        id: 'jsx',
        scopeName: 'documentation.injection.js.jsx',
        path: 'jsx.tmLanguage.json'
    },
    {
        id: 'julia',
        scopeName: 'source.julia',
        path: 'julia.tmLanguage.json'
    },
    {
        id: 'kotlin',
        scopeName: 'source.kotlin',
        path: 'kotlin.tmLanguage.json'
    },
    {
        id: 'latex',
        scopeName: 'text.tex.latex',
        path: 'latex.tmLanguage.json'
    },
    {
        id: 'less',
        scopeName: 'source.css.less',
        path: 'less.tmLanguage.json'
    },
    {
        id: 'lisp',
        scopeName: 'source.lisp',
        path: 'lisp.tmLanguage.json'
    },
    {
        id: 'logo',
        scopeName: 'source.logo',
        path: 'logo.tmLanguage.json'
    },
    {
        id: 'lua',
        scopeName: 'source.lua',
        path: 'lua.tmLanguage.json'
    },
    {
        id: 'makefile',
        scopeName: 'source.makefile',
        path: 'makefile.tmLanguage.json'
    },
    {
        id: 'markdown',
        scopeName: 'text.html.markdown',
        path: 'markdown.tmLanguage.json',
        aliases: ['md']
    },
    {
        id: 'matlab',
        scopeName: 'source.matlab',
        path: 'matlab.tmLanguage.json'
    },
    {
        id: 'nix',
        scopeName: 'source.nix',
        path: 'nix.tmLanguage.json'
    },
    {
        id: 'objective-c',
        scopeName: 'source.objcpp',
        path: 'objective-c.tmLanguage.json',
        aliases: ['objc']
    },
    {
        id: 'ocaml',
        scopeName: 'source.ocaml',
        path: 'ocaml.tmLanguage.json'
    },
    {
        id: 'pascal',
        scopeName: 'source.pascal',
        path: 'pascal.tmLanguage.json'
    },
    {
        id: 'perl',
        scopeName: 'source.perl',
        path: 'perl.tmLanguage.json'
    },
    {
        id: 'perl6',
        scopeName: 'source.perl.6',
        path: 'perl6.tmLanguage.json'
    },
    {
        id: 'php-html',
        scopeName: 'text.html.php',
        path: 'php-html.tmLanguage.json'
    },
    {
        id: 'php',
        scopeName: 'source.php',
        path: 'php.tmLanguage.json'
    },
    {
        id: 'pls',
        scopeName: 'source.plsql.oracle',
        path: 'pls.tmLanguage.json'
    },
    {
        id: 'postcss',
        scopeName: 'source.css.postcss',
        path: 'postcss.tmLanguage.json'
    },
    {
        id: 'powershell',
        scopeName: 'source.powershell',
        path: 'powershell.tmLanguage.json',
        aliases: ['ps', 'ps1']
    },
    {
        id: 'prolog',
        scopeName: 'source.prolog',
        path: 'prolog.tmLanguage.json'
    },
    {
        id: 'pug',
        scopeName: 'text.pug',
        path: 'pug.tmLanguage.json',
        aliases: ['jade']
    },
    {
        id: 'puppet',
        scopeName: 'source.puppet',
        path: 'puppet.tmLanguage.json'
    },
    {
        id: 'purescript',
        scopeName: 'source.purescript',
        path: 'purescript.tmLanguage.json'
    },
    {
        id: 'python',
        scopeName: 'source.python',
        path: 'python.tmLanguage.json',
        aliases: ['py']
    },
    {
        id: 'r',
        scopeName: 'source.r',
        path: 'r.tmLanguage.json'
    },
    {
        id: 'razor',
        scopeName: 'text.html.cshtml',
        path: 'razor.tmLanguage.json'
    },
    {
        id: 'ruby',
        scopeName: 'source.ruby',
        path: 'ruby.tmLanguage.json',
        aliases: ['rb']
    },
    {
        id: 'rust',
        scopeName: 'source.rust',
        path: 'rust.tmLanguage.json'
    },
    {
        id: 'sas',
        scopeName: 'source.sas',
        path: 'sas.tmLanguage.json'
    },
    {
        id: 'sass',
        scopeName: 'source.sass',
        path: 'sass.tmLanguage.json'
    },
    {
        id: 'scala',
        scopeName: 'source.scala',
        path: 'scala.tmLanguage.json'
    },
    {
        id: 'scheme',
        scopeName: 'source.scheme',
        path: 'scheme.tmLanguage.json'
    },
    {
        id: 'scss',
        scopeName: 'source.css.scss',
        path: 'scss.tmLanguage.json'
    },
    {
        id: 'shaderlab',
        scopeName: 'source.shaderlab',
        path: 'shaderlab.tmLanguage.json',
        aliases: ['shader']
    },
    {
        id: 'shellscript',
        scopeName: 'source.shell',
        path: 'shellscript.tmLanguage.json',
        aliases: ['shell', 'bash', 'sh', 'zsh']
    },
    {
        id: 'smalltalk',
        scopeName: 'source.smalltalk',
        path: 'smalltalk.tmLanguage.json'
    },
    {
        id: 'sql',
        scopeName: 'source.sql',
        path: 'sql.tmLanguage.json'
    },
    {
        id: 'ssh-config',
        scopeName: 'source.ssh-config',
        path: 'ssh-config.tmLanguage.json'
    },
    {
        id: 'stylus',
        scopeName: 'source.stylus',
        path: 'stylus.tmLanguage.json',
        aliases: ['styl']
    },
    {
        id: 'swift',
        scopeName: 'source.swift',
        path: 'swift.tmLanguage.json'
    },
    {
        id: 'tcl',
        scopeName: 'source.tcl',
        path: 'tcl.tmLanguage.json'
    },
    {
        id: 'toml',
        scopeName: 'source.toml',
        path: 'toml.tmLanguage.json'
    },
    {
        id: 'ts',
        scopeName: 'documentation.injection.ts',
        path: 'ts.tmLanguage.json'
    },
    {
        id: 'tsx',
        scopeName: 'source.tsx',
        path: 'tsx.tmLanguage.json'
    },
    {
        id: 'typescript',
        scopeName: 'source.ts',
        path: 'typescript.tmLanguage.json',
        aliases: ['ts']
    },
    {
        id: 'vb',
        scopeName: 'source.asp.vb.net',
        path: 'vb.tmLanguage.json',
        aliases: ['cmd']
    },
    {
        id: 'viml',
        scopeName: 'source.viml',
        path: 'viml.tmLanguage.json'
    },
    {
        id: 'vue-html',
        scopeName: 'text.html.vue-html',
        path: 'vue-html.tmLanguage.json'
    },
    {
        id: 'vue',
        scopeName: 'source.vue',
        path: 'vue.tmLanguage.json'
    },
    {
        id: 'wasm',
        scopeName: 'source.wat',
        path: 'wasm.tmLanguage.json'
    },
    {
        id: 'xml',
        scopeName: 'text.xml',
        path: 'xml.tmLanguage.json'
    },
    {
        id: 'xsl',
        scopeName: 'text.xml.xsl',
        path: 'xsl.tmLanguage.json'
    },
    {
        id: 'yaml',
        scopeName: 'source.yaml',
        path: 'yaml.tmLanguage.json'
    },
    {
        id: '文言',
        scopeName: 'source.wenyan',
        path: '文言.tmLanguage.json',
        aliases: ['wenyan']
    }
];

function trimEndSlash(str) {
    if (str.endsWith('/') || str.endsWith('\\'))
        return str.slice(0, -1);
    return str;
}
function trimStartDot(str) {
    if (str.startsWith('./'))
        return str.slice(2);
    return str;
}
function dirname(str) {
    const parts = str.split(/[\/\\]/g);
    return parts[parts.length - 2];
}
function join(...parts) {
    return parts.map(trimEndSlash).map(trimStartDot).join('/');
}

const isBrowser = typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof fetch !== 'undefined';
// to be replaced by rollup
let CDN_ROOT = '';
let ONIGASM_WASM = '';
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
function setCDN(root) {
    CDN_ROOT = root;
}
/**
 * Explicitly set the source for loading the OnigasmWASM
 *
 * Accepts Url or ArrayBuffer
 */
function setOnigasmWASM(path) {
    ONIGASM_WASM = path;
}
let _onigasmPromise = null;
async function getOnigasm() {
    if (!_onigasmPromise) {
        let loader;
        if (isBrowser) {
            loader = loadWASM(ONIGASM_WASM || _resolvePath('dist/onigasm.wasm'));
        }
        else {
            const path = require('path');
            const onigasmPath = path.join(require.resolve('onigasm'), '../onigasm.wasm');
            const fs = require('fs');
            const wasmBin = fs.readFileSync(onigasmPath).buffer;
            loader = loadWASM(wasmBin);
        }
        _onigasmPromise = loader.then(() => {
            return {
                createOnigScanner(patterns) {
                    return new OnigScanner(patterns);
                },
                createOnigString(s) {
                    return new OnigString(s);
                }
            };
        });
    }
    return _onigasmPromise;
}
function _resolvePath(filepath) {
    if (isBrowser) {
        if (!CDN_ROOT) {
            console.warn('[Shiki] no CDN provider found, use `setCDN()` to specify the CDN for loading the resources before calling `getHighlighter()`');
        }
        return `${CDN_ROOT}${filepath}`;
    }
    else {
        const path = require('path');
        if (path.isAbsolute(filepath)) {
            return filepath;
        }
        else {
            return path.resolve(__dirname, '..', filepath);
        }
    }
}
/**
 * @param filepath assert path related to ./packages/shiki
 */
async function _fetchAssets(filepath) {
    const path = _resolvePath(filepath);
    if (isBrowser) {
        return await fetch(path).then(r => r.text());
    }
    else {
        const fs = require('fs');
        return await fs.promises.readFile(path, 'utf-8');
    }
}
async function _fetchJSONAssets(filepath) {
    return JSON.parse(await _fetchAssets(filepath));
}
/**
 * @param themePath related path to theme.json
 */
async function fetchTheme(themePath) {
    let theme = await _fetchJSONAssets(themePath);
    const shikiTheme = toShikiTheme(theme);
    if (shikiTheme.include) {
        const includedTheme = await fetchTheme(join(dirname(themePath), shikiTheme.include));
        if (includedTheme.settings) {
            shikiTheme.settings = shikiTheme.settings.concat(includedTheme.settings);
        }
        if (includedTheme.bg && !shikiTheme.bg) {
            shikiTheme.bg = includedTheme.bg;
        }
    }
    return shikiTheme;
}
async function fetchGrammar(filepath) {
    const content = await _fetchAssets(filepath);
    return JSON.parse(content);
}
function repairTheme(theme) {
    // Has the default no-scope setting with fallback colors
    if (theme.settings[0].settings && !theme.settings[0].scope) {
        return;
    }
    // Push a no-scope setting with fallback colors
    theme.settings.unshift({
        settings: {
            foreground: theme.fg,
            background: theme.bg
        }
    });
}
function toShikiTheme(rawTheme) {
    const shikiTheme = Object.assign(Object.assign({}, rawTheme), getThemeDefaultColors(rawTheme));
    if (rawTheme.include) {
        shikiTheme.include = rawTheme.include;
    }
    if (rawTheme.tokenColors) {
        shikiTheme.settings = rawTheme.tokenColors;
    }
    repairTheme(shikiTheme);
    return shikiTheme;
}
/**
 * https://github.com/microsoft/vscode/blob/f7f05dee53fb33fe023db2e06e30a89d3094488f/src/vs/platform/theme/common/colorRegistry.ts#L258-L268
 */
const VSCODE_FALLBACK_EDITOR_FG = { light: '#333333', dark: '#bbbbbb' };
const VSCODE_FALLBACK_EDITOR_BG = { light: '#fffffe', dark: '#1e1e1e' };
function getThemeDefaultColors(theme) {
    var _a, _b, _c, _d, _e, _f;
    let fg, bg;
    /**
     * First try:
     * Theme might contain a global `tokenColor` without `name` or `scope`
     * Used as default value for foreground/background
     */
    let settings = theme.settings ? theme.settings : theme.tokenColors;
    const globalSetting = settings
        ? settings.find(s => {
            return !s.name && !s.scope;
        })
        : undefined;
    if ((_a = globalSetting === null || globalSetting === void 0 ? void 0 : globalSetting.settings) === null || _a === void 0 ? void 0 : _a.foreground) {
        fg = globalSetting.settings.foreground;
    }
    if ((_b = globalSetting === null || globalSetting === void 0 ? void 0 : globalSetting.settings) === null || _b === void 0 ? void 0 : _b.background) {
        bg = globalSetting.settings.background;
    }
    /**
     * Second try:
     * If there's no global `tokenColor` without `name` or `scope`
     * Use `editor.foreground` and `editor.background`
     */
    if (!fg && ((_d = (_c = theme) === null || _c === void 0 ? void 0 : _c.colors) === null || _d === void 0 ? void 0 : _d['editor.foreground'])) {
        fg = theme.colors['editor.foreground'];
    }
    if (!bg && ((_f = (_e = theme) === null || _e === void 0 ? void 0 : _e.colors) === null || _f === void 0 ? void 0 : _f['editor.background'])) {
        bg = theme.colors['editor.background'];
    }
    /**
     * Last try:
     * If there's no fg/bg color specified in theme, use default
     */
    if (!fg) {
        fg = theme.type === 'light' ? VSCODE_FALLBACK_EDITOR_FG.light : VSCODE_FALLBACK_EDITOR_FG.dark;
    }
    if (!bg) {
        bg = theme.type === 'light' ? VSCODE_FALLBACK_EDITOR_BG.light : VSCODE_FALLBACK_EDITOR_BG.dark;
    }
    return {
        fg,
        bg
    };
}

/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
class Resolver {
    constructor(onigLibPromise, onigLibName) {
        this.languagesPath = 'languages/';
        this.languageMap = {};
        this.scopeToLangMap = {};
        this._onigLibPromise = onigLibPromise;
        this._onigLibName = onigLibName;
    }
    get onigLib() {
        return this._onigLibPromise;
    }
    getOnigLibName() {
        return this._onigLibName;
    }
    getLangRegistration(langIdOrAlias) {
        return this.languageMap[langIdOrAlias];
    }
    async loadGrammar(scopeName) {
        const lang = this.scopeToLangMap[scopeName];
        if (!lang) {
            return null;
        }
        if (lang.grammar) {
            return lang.grammar;
        }
        const g = await fetchGrammar(languages.includes(lang) ? `${this.languagesPath}${lang.path}` : lang.path);
        lang.grammar = g;
        return g;
    }
    addLanguage(l) {
        this.languageMap[l.id] = l;
        if (l.aliases) {
            l.aliases.forEach(a => {
                this.languageMap[a] = l;
            });
        }
        this.scopeToLangMap[l.scopeName] = l;
    }
}

class StackElementMetadata {
    static toBinaryStr(metadata) {
        let r = metadata.toString(2);
        while (r.length < 32) {
            r = '0' + r;
        }
        return r;
    }
    static printMetadata(metadata) {
        let languageId = StackElementMetadata.getLanguageId(metadata);
        let tokenType = StackElementMetadata.getTokenType(metadata);
        let fontStyle = StackElementMetadata.getFontStyle(metadata);
        let foreground = StackElementMetadata.getForeground(metadata);
        let background = StackElementMetadata.getBackground(metadata);
        console.log({
            languageId: languageId,
            tokenType: tokenType,
            fontStyle: fontStyle,
            foreground: foreground,
            background: background
        });
    }
    static getLanguageId(metadata) {
        return (metadata & 255 /* LANGUAGEID_MASK */) >>> 0 /* LANGUAGEID_OFFSET */;
    }
    static getTokenType(metadata) {
        return (metadata & 1792 /* TOKEN_TYPE_MASK */) >>> 8 /* TOKEN_TYPE_OFFSET */;
    }
    static getFontStyle(metadata) {
        return (metadata & 14336 /* FONT_STYLE_MASK */) >>> 11 /* FONT_STYLE_OFFSET */;
    }
    static getForeground(metadata) {
        return (metadata & 8372224 /* FOREGROUND_MASK */) >>> 14 /* FOREGROUND_OFFSET */;
    }
    static getBackground(metadata) {
        return (metadata & 4286578688 /* BACKGROUND_MASK */) >>> 23 /* BACKGROUND_OFFSET */;
    }
    static set(metadata, languageId, tokenType, fontStyle, foreground, background) {
        let _languageId = StackElementMetadata.getLanguageId(metadata);
        let _tokenType = StackElementMetadata.getTokenType(metadata);
        let _fontStyle = StackElementMetadata.getFontStyle(metadata);
        let _foreground = StackElementMetadata.getForeground(metadata);
        let _background = StackElementMetadata.getBackground(metadata);
        if (languageId !== 0) {
            _languageId = languageId;
        }
        if (tokenType !== 0 /* Other */) {
            _tokenType =
                tokenType === 8 /* MetaEmbedded */ ? 0 /* Other */ : tokenType;
        }
        if (fontStyle !== -1 /* NotSet */) {
            _fontStyle = fontStyle;
        }
        if (foreground !== 0) {
            _foreground = foreground;
        }
        if (background !== 0) {
            _background = background;
        }
        return (((_languageId << 0 /* LANGUAGEID_OFFSET */) |
            (_tokenType << 8 /* TOKEN_TYPE_OFFSET */) |
            (_fontStyle << 11 /* FONT_STYLE_OFFSET */) |
            (_foreground << 14 /* FOREGROUND_OFFSET */) |
            (_background << 23 /* BACKGROUND_OFFSET */)) >>>
            0);
    }
}

/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
function tokenizeWithTheme(theme, colorMap, fileContents, grammar, options) {
    let lines = fileContents.split(/\r\n|\r|\n/);
    let ruleStack = null;
    let actual = [];
    let final = [];
    for (let i = 0, len = lines.length; i < len; i++) {
        let line = lines[i];
        if (line === '') {
            actual = [];
            final.push([]);
            continue;
        }
        let resultWithScopes = grammar.tokenizeLine(line, ruleStack);
        let tokensWithScopes = resultWithScopes.tokens;
        let result = grammar.tokenizeLine2(line, ruleStack);
        let tokensLength = result.tokens.length / 2;
        let tokensWithScopesIndex = 0;
        for (let j = 0; j < tokensLength; j++) {
            let startIndex = result.tokens[2 * j];
            let nextStartIndex = j + 1 < tokensLength ? result.tokens[2 * j + 2] : line.length;
            if (startIndex === nextStartIndex) {
                continue;
            }
            let metadata = result.tokens[2 * j + 1];
            let foreground = StackElementMetadata.getForeground(metadata);
            let foregroundColor = colorMap[foreground];
            let explanation = [];
            if (options.includeExplanation) {
                let offset = 0;
                while (startIndex + offset < nextStartIndex) {
                    let tokenWithScopes = tokensWithScopes[tokensWithScopesIndex];
                    let tokenWithScopesText = line.substring(tokenWithScopes.startIndex, tokenWithScopes.endIndex);
                    offset += tokenWithScopesText.length;
                    explanation.push({
                        content: tokenWithScopesText,
                        scopes: explainThemeScopes(theme, tokenWithScopes.scopes)
                    });
                    tokensWithScopesIndex++;
                }
            }
            actual.push({
                content: line.substring(startIndex, nextStartIndex),
                color: foregroundColor,
                explanation: explanation
            });
        }
        final.push(actual);
        actual = [];
        ruleStack = result.ruleStack;
    }
    return final;
}
function explainThemeScopes(theme, scopes) {
    let result = [];
    for (let i = 0, len = scopes.length; i < len; i++) {
        let parentScopes = scopes.slice(0, i);
        let scope = scopes[i];
        result[i] = {
            scopeName: scope,
            themeMatches: explainThemeScope(theme, scope, parentScopes)
        };
    }
    return result;
}
function matchesOne(selector, scope) {
    let selectorPrefix = selector + '.';
    if (selector === scope || scope.substring(0, selectorPrefix.length) === selectorPrefix) {
        return true;
    }
    return false;
}
function matches(selector, selectorParentScopes, scope, parentScopes) {
    if (!matchesOne(selector, scope)) {
        return false;
    }
    let selectorParentIndex = selectorParentScopes.length - 1;
    let parentIndex = parentScopes.length - 1;
    while (selectorParentIndex >= 0 && parentIndex >= 0) {
        if (matchesOne(selectorParentScopes[selectorParentIndex], parentScopes[parentIndex])) {
            selectorParentIndex--;
        }
        parentIndex--;
    }
    if (selectorParentIndex === -1) {
        return true;
    }
    return false;
}
function explainThemeScope(theme, scope, parentScopes) {
    let result = [], resultLen = 0;
    for (let i = 0, len = theme.settings.length; i < len; i++) {
        let setting = theme.settings[i];
        let selectors;
        if (typeof setting.scope === 'string') {
            selectors = setting.scope.split(/,/).map(scope => scope.trim());
        }
        else if (Array.isArray(setting.scope)) {
            selectors = setting.scope;
        }
        else {
            continue;
        }
        for (let j = 0, lenJ = selectors.length; j < lenJ; j++) {
            let rawSelector = selectors[j];
            let rawSelectorPieces = rawSelector.split(/ /);
            let selector = rawSelectorPieces[rawSelectorPieces.length - 1];
            let selectorParentScopes = rawSelectorPieces.slice(0, rawSelectorPieces.length - 1);
            if (matches(selector, selectorParentScopes, scope, parentScopes)) {
                // match!
                result[resultLen++] = setting;
                // break the loop
                j = lenJ;
            }
        }
    }
    return result;
}

function renderToHtml(lines, options = {}) {
    const bg = options.bg || '#fff';
    let html = '';
    html += `<pre class="shiki" style="background-color: ${bg}">`;
    if (options.langId) {
        html += `<div class="language-id">${options.langId}</div>`;
    }
    html += `<code>`;
    lines.forEach((l) => {
        if (l.length === 0) {
            html += `\n`;
        }
        else {
            html += `<span class="line">`;
            l.forEach(token => {
                html += `<span style="color: ${token.color || options.fg}">${escapeHtml(token.content)}</span>`;
            });
            html += `</span>\n`;
        }
    });
    html = html.replace(/\n*$/, ''); // Get rid of final new lines
    html += `</code></pre>`;
    return html;
}
const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};
function escapeHtml(html) {
    return html.replace(/[&<>"']/g, chr => htmlEscapes[chr]);
}

class Registry extends Registry$1 {
    constructor(_resolver) {
        super(_resolver);
        this._resolver = _resolver;
        this.themesPath = 'themes/';
        this._resolvedThemes = {};
        this._resolvedGammer = {};
    }
    getTheme(theme) {
        if (typeof theme === 'string') {
            return this._resolvedThemes[theme];
        }
        else {
            return theme;
        }
    }
    async loadTheme(theme) {
        if (typeof theme === 'string') {
            if (!this._resolvedThemes[theme]) {
                this._resolvedThemes[theme] = await fetchTheme(`${this.themesPath}${theme}.json`);
            }
            return this._resolvedThemes[theme];
        }
        else {
            theme = toShikiTheme(theme);
            if (theme.name) {
                this._resolvedThemes[theme.name] = theme;
            }
            return theme;
        }
    }
    async loadThemes(themes) {
        return await Promise.all(themes.map(theme => this.loadTheme(theme)));
    }
    getGrammer(name) {
        return this._resolvedGammer[name];
    }
    async loadLanguage(lang) {
        const g = await this.loadGrammar(lang.scopeName);
        this._resolvedGammer[lang.id] = g;
        if (lang.aliases) {
            lang.aliases.forEach(la => {
                this._resolvedGammer[la] = g;
            });
        }
    }
    async loadLanguages(langs) {
        for (const lang of langs) {
            this._resolver.addLanguage(lang);
        }
        for (const lang of langs) {
            await this.loadLanguage(lang);
        }
    }
}

function resolveLang(lang) {
    return typeof lang === 'string'
        ? languages.find(l => { var _a; return l.id === lang || ((_a = l.aliases) === null || _a === void 0 ? void 0 : _a.includes(lang)); })
        : lang;
}
function resolveOptions(options) {
    var _a;
    let _languages = languages;
    let _themes = options.themes || [];
    if ((_a = options.langs) === null || _a === void 0 ? void 0 : _a.length) {
        _languages = options.langs.map(resolveLang);
    }
    if (options.theme) {
        _themes.unshift(options.theme);
    }
    if (!_themes.length) {
        _themes = ['nord'];
    }
    return { _languages, _themes };
}
async function getHighlighter(options) {
    var _a, _b;
    const { _languages, _themes } = resolveOptions(options);
    const _resolver = new Resolver(getOnigasm(), 'onigasm');
    const _registry = new Registry(_resolver);
    const themes = await _registry.loadThemes(_themes);
    const _defaultTheme = themes[0];
    await _registry.loadLanguages(_languages);
    if ((_a = options.paths) === null || _a === void 0 ? void 0 : _a.themes) {
        _registry.themesPath = options.paths.themes;
    }
    if ((_b = options.paths) === null || _b === void 0 ? void 0 : _b.languages) {
        _resolver.languagesPath = options.paths.languages;
    }
    function getTheme(theme) {
        const _theme = theme ? _registry.getTheme(theme) : _defaultTheme;
        if (!_theme) {
            throw Error(`No theme registration for ${theme}`);
        }
        _registry.setTheme(_theme);
        const _colorMap = _registry.getColorMap();
        return { _theme, _colorMap };
    }
    function getGrammer(lang) {
        const _grammer = _registry.getGrammer(lang);
        if (!_grammer) {
            throw Error(`No language registration for ${lang}`);
        }
        return { _grammer };
    }
    function codeToThemedTokens(code, lang = 'text', theme, options = { includeExplanation: true }) {
        if (isPlaintext(lang)) {
            return [[{ content: code }]];
        }
        const { _grammer } = getGrammer(lang);
        const { _theme, _colorMap } = getTheme(theme);
        return tokenizeWithTheme(_theme, _colorMap, code, _grammer, options);
    }
    function codeToHtml(code, lang = 'text', theme) {
        const tokens = codeToThemedTokens(code, lang, theme, {
            includeExplanation: false
        });
        const { _theme } = getTheme(theme);
        return renderToHtml(tokens, {
            fg: _theme.fg,
            bg: _theme.bg
        });
    }
    async function loadTheme(theme) {
        await _registry.loadTheme(theme);
    }
    async function loadLanguage(lang) {
        const _lang = resolveLang(lang);
        _resolver.addLanguage(_lang);
        await _registry.loadLanguage(_lang);
    }
    function getBackgroundColor(theme) {
        const { _theme } = getTheme(theme);
        return _theme.bg;
    }
    function getForegroundColor(theme) {
        const { _theme } = getTheme(theme);
        return _theme.fg;
    }
    return {
        codeToThemedTokens,
        codeToHtml,
        loadTheme,
        loadLanguage,
        getBackgroundColor,
        getForegroundColor
    };
}
function isPlaintext(lang) {
    return !lang || ['plaintext', 'txt', 'text'].includes(lang);
}

export { languages as BUNDLED_LANGUAGES, themes as BUNDLED_THEMES, getHighlighter, fetchTheme as loadTheme, renderToHtml, setCDN, setOnigasmWASM };
