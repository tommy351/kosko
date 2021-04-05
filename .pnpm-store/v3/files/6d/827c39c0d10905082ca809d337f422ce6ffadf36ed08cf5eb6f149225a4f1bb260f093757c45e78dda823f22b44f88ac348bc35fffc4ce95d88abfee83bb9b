"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comments = void 0;
const fs = require("fs");
const path = require("path");
const Util = require("util");
const Handlebars = require("handlebars");
const typedoc_1 = require("typedoc");
const components_1 = require("typedoc/dist/lib/output/components");
const events_1 = require("typedoc/dist/lib/output/events");
const plugins_1 = require("typedoc/dist/lib/output/plugins");
const theme_1 = require("../theme");
let Comments = class Comments extends components_1.ContextAwareRendererComponent {
    constructor() {
        super(...arguments);
        this.includePattern = /\[\[include:([^\]]+?)\]\]/g;
        this.mediaPattern = /media:\/\/([^ "\)\]\}]+)/g;
        this.brackets = /\[\[([^\]]+)\]\]/g;
        this.inlineTag = /(?:\[(.+?)\])?\{@(link|linkcode|linkplain)\s+((?:.|\n)+?)\}/gi;
        this.warnings = [];
    }
    initialize() {
        super.initialize();
        this.listenTo(this.owner, {
            [events_1.RendererEvent.END]: this.onEndRenderer,
        }, undefined, 100);
        const component = this;
        theme_1.default.HANDLEBARS.registerHelper('comment', function () {
            return component.parseComments(this);
        });
    }
    parseComments(text) {
        const context = Object.assign(text, '');
        if (this.includes) {
            text = text.replace(this.includePattern, (match, includesPath) => {
                includesPath = path.join(this.includes, includesPath.trim());
                if (fs.existsSync(includesPath) &&
                    fs.statSync(includesPath).isFile()) {
                    const contents = fs.readFileSync(includesPath, 'utf-8');
                    if (includesPath.substr(-4).toLocaleLowerCase() === '.hbs') {
                        const template = Handlebars.compile(contents);
                        return template(context);
                    }
                    else {
                        return contents;
                    }
                }
                else {
                    return '';
                }
            });
        }
        if (this.mediaDirectory) {
            text = text.replace(this.mediaPattern, (match, mediaPath) => {
                if (fs.existsSync(path.join(this.mediaDirectory, mediaPath))) {
                    return (theme_1.default.HANDLEBARS.helpers.relativeURL('media') +
                        '/' +
                        mediaPath);
                }
                else {
                    return match;
                }
            });
        }
        return this.replaceInlineTags(this.replaceBrackets(text));
    }
    replaceBrackets(text) {
        return text.replace(this.brackets, (match, content) => {
            const split = plugins_1.MarkedLinksPlugin.splitLinkText(content);
            return this.buildLink(match, split.target, split.caption);
        });
    }
    replaceInlineTags(text) {
        return text.replace(this.inlineTag, (match, leading, tagName, content) => {
            const split = plugins_1.MarkedLinksPlugin.splitLinkText(content);
            const target = split.target;
            const caption = leading || split.caption;
            const monospace = tagName === 'linkcode';
            return this.buildLink(match, target, caption, monospace);
        });
    }
    buildLink(original, target, caption, monospace) {
        if (!this.urlPrefix.test(target)) {
            let reflection;
            if (this.reflection) {
                reflection = this.reflection.findReflectionByName(target);
            }
            else if (this.project) {
                reflection = this.project.findReflectionByName(target);
            }
            if (reflection && reflection.url) {
                if (this.urlPrefix.test(reflection.url)) {
                    target = reflection.url;
                }
                else {
                    target = theme_1.default.HANDLEBARS.helpers.relativeURL(reflection.url);
                }
            }
            else {
                const fullName = (this.reflection || this.project).getFullName();
                this.warnings.push(`In ${fullName}: ${original}`);
                return original;
            }
        }
        if (monospace) {
            caption = '`' + caption + '`';
        }
        return Util.format('[%s](%s)', caption, target);
    }
    onEndRenderer(event) {
        if (this.listInvalidSymbolLinks && this.warnings.length > 0) {
            this.application.logger.warn('Found invalid symbol reference(s) in JSDocs, ' +
                'they will not render as links in the generated documentation.');
            for (const warning of this.warnings) {
                this.application.logger.write('  ' + warning);
            }
        }
    }
};
__decorate([
    typedoc_1.BindOption('includes')
], Comments.prototype, "includes", void 0);
__decorate([
    typedoc_1.BindOption('media')
], Comments.prototype, "mediaDirectory", void 0);
__decorate([
    typedoc_1.BindOption('listInvalidSymbolLinks')
], Comments.prototype, "listInvalidSymbolLinks", void 0);
Comments = __decorate([
    components_1.Component({ name: 'comments' })
], Comments);
exports.Comments = Comments;
