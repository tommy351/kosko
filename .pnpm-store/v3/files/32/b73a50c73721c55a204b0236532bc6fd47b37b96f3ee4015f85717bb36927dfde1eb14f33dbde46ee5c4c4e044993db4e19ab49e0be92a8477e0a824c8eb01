"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highlight = exports.getSupportedLanguages = exports.isSupportedLanguage = exports.loadHighlighter = void 0;
const assert_1 = require("assert");
const shiki = require("shiki");
const array_1 = require("./array");
// This is needed because Shiki includes some "fake" languages
// ts / js are expected by users to be equivalent to typescript / javascript
const aliases = new Map([
    ["ts", "typescript"],
    ["js", "javascript"],
    ["bash", "shellscript"],
    ["sh", "shellscript"],
    ["shell", "shellscript"],
]);
const supportedLanguages = array_1.unique([
    "text",
    ...aliases.keys(),
    ...shiki.BUNDLED_LANGUAGES.map((lang) => lang.id),
]).sort();
let highlighter;
async function loadHighlighter(theme) {
    if (highlighter)
        return;
    highlighter = await shiki.getHighlighter({ theme });
}
exports.loadHighlighter = loadHighlighter;
function isSupportedLanguage(lang) {
    return getSupportedLanguages().includes(lang);
}
exports.isSupportedLanguage = isSupportedLanguage;
function getSupportedLanguages() {
    return supportedLanguages;
}
exports.getSupportedLanguages = getSupportedLanguages;
function highlight(code, lang, theme) {
    var _a, _b;
    assert_1.ok(highlighter, "Tried to highlight with an uninitialized highlighter");
    if (!isSupportedLanguage(lang)) {
        return code;
    }
    if (lang === "text") {
        return escapeHtml(code);
    }
    lang = (_a = aliases.get(lang)) !== null && _a !== void 0 ? _a : lang;
    const result = [];
    for (const line of highlighter.codeToThemedTokens(code, lang, theme, {
        includeExplanation: false,
    })) {
        for (const token of line) {
            result.push(`<span style="color: ${(_b = token.color) !== null && _b !== void 0 ? _b : "#000"}">`, escapeHtml(token.content), "</span>");
        }
        result.push("\n");
    }
    return result.join("");
}
exports.highlight = highlight;
function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (match) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    }[match]));
}
