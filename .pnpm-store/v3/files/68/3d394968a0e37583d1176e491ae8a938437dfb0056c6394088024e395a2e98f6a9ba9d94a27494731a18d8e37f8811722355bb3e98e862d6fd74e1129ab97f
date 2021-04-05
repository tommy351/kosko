"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reflectionTitle = void 0;
const theme_1 = require("../../theme");
const escape_1 = require("./escape");
function reflectionTitle(shouldEscape = true) {
    const title = [''];
    if (this.model && this.model.kindString && this.url !== this.project.url) {
        title.push(`${this.model.kindString}: `);
    }
    if (this.url === this.project.url) {
        title.push(theme_1.default.HANDLEBARS.helpers.indexTitle() || this.project.name);
    }
    else {
        title.push(shouldEscape ? escape_1.escape(this.model.name) : this.model.name);
        if (this.model.typeParameters) {
            const typeParameters = this.model.typeParameters
                .map((typeParameter) => typeParameter.name)
                .join(', ');
            title.push(`<${typeParameters}${shouldEscape ? '\\>' : '>'}`);
        }
    }
    return title.join('');
}
exports.reflectionTitle = reflectionTitle;
