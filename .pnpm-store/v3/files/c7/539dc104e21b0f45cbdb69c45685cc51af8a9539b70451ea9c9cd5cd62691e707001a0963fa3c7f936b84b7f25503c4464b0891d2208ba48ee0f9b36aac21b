"use strict";
/**
 * Holds all logic used render and output the final documentation.
 *
 * The [[Renderer]] class is the central controller within this namespace. When invoked it creates
 * an instance of [[BaseTheme]] which defines the layout of the documentation and fires a
 * series of [[RendererEvent]] events. Instances of [[BasePlugin]] can listen to these events and
 * alter the generated output.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Renderer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
const Path = require("path");
const FS = require("fs-extra");
// eslint-disable-next-line
const ProgressBar = require("progress");
const events_1 = require("./events");
const fs_1 = require("../utils/fs");
const DefaultTheme_1 = require("./themes/DefaultTheme");
const components_1 = require("./components");
const component_1 = require("../utils/component");
const utils_1 = require("../utils");
const highlighter_1 = require("../utils/highlighter");
/**
 * The renderer processes a [[ProjectReflection]] using a [[BaseTheme]] instance and writes
 * the emitted html documents to a output directory. You can specify which theme should be used
 * using the ```--theme <name>``` command line argument.
 *
 * Subclasses of [[BasePlugin]] that have registered themselves in the [[Renderer.PLUGIN_CLASSES]]
 * will be automatically initialized. Most of the core functionality is provided as separate plugins.
 *
 * [[Renderer]] is a subclass of [[EventDispatcher]] and triggers a series of events while
 * a project is being processed. You can listen to these events to control the flow or manipulate
 * the output.
 *
 *  * [[Renderer.EVENT_BEGIN]]<br>
 *    Triggered before the renderer starts rendering a project. The listener receives
 *    an instance of [[RendererEvent]]. By calling [[RendererEvent.preventDefault]] the entire
 *    render process can be canceled.
 *
 *    * [[Renderer.EVENT_BEGIN_PAGE]]<br>
 *      Triggered before a document will be rendered. The listener receives an instance of
 *      [[PageEvent]]. By calling [[PageEvent.preventDefault]] the generation of the
 *      document can be canceled.
 *
 *    * [[Renderer.EVENT_END_PAGE]]<br>
 *      Triggered after a document has been rendered, just before it is written to disc. The
 *      listener receives an instance of [[PageEvent]]. When calling
 *      [[PageEvent.preventDefault]] the the document will not be saved to disc.
 *
 *  * [[Renderer.EVENT_END]]<br>
 *    Triggered after the renderer has written all documents. The listener receives
 *    an instance of [[RendererEvent]].
 */
let Renderer = Renderer_1 = class Renderer extends component_1.ChildableComponent {
    /**
     * Render the given project reflection to the specified output directory.
     *
     * @param project  The project that should be rendered.
     * @param outputDirectory  The path of the directory the documentation should be rendered to.
     */
    async render(project, outputDirectory) {
        await highlighter_1.loadHighlighter(this.highlightTheme);
        if (!this.prepareTheme() ||
            !this.prepareOutputDirectory(outputDirectory)) {
            return;
        }
        const output = new events_1.RendererEvent(events_1.RendererEvent.BEGIN, outputDirectory, project);
        output.settings = this.application.options.getRawValues();
        output.urls = this.theme.getUrls(project);
        const bar = new ProgressBar("Rendering [:bar] :percent", {
            total: output.urls.length,
            width: 40,
        });
        this.trigger(output);
        if (!output.isDefaultPrevented) {
            output.urls.forEach((mapping) => {
                this.renderDocument(output.createPageEvent(mapping));
                bar.tick();
            });
            this.trigger(events_1.RendererEvent.END, output);
        }
    }
    /**
     * Render a single page.
     *
     * @param page An event describing the current page.
     * @return TRUE if the page has been saved to disc, otherwise FALSE.
     */
    renderDocument(page) {
        this.trigger(events_1.PageEvent.BEGIN, page);
        if (page.isDefaultPrevented) {
            return false;
        }
        // Theme must be set as this is only called in render, and render ensures theme is set.
        page.template =
            page.template ||
                this.theme.resources.templates.getResource(page.templateName).getTemplate();
        page.contents = page.template(page, {
            allowProtoMethodsByDefault: true,
            allowProtoPropertiesByDefault: true,
        });
        this.trigger(events_1.PageEvent.END, page);
        if (page.isDefaultPrevented) {
            return false;
        }
        try {
            fs_1.writeFile(page.filename, page.contents, false);
        }
        catch (error) {
            this.application.logger.error("Could not write %s", page.filename);
            return false;
        }
        return true;
    }
    /**
     * Ensure that a theme has been setup.
     *
     * If a the user has set a theme we try to find and load it. If no theme has
     * been specified we load the default theme.
     *
     * @returns TRUE if a theme has been setup, otherwise FALSE.
     */
    prepareTheme() {
        if (!this.theme) {
            const themeName = this.themeName;
            let path = Path.resolve(themeName);
            if (!FS.existsSync(path)) {
                path = Path.join(Renderer_1.getThemeDirectory(), themeName);
                if (!FS.existsSync(path)) {
                    this.application.logger.error("The theme %s could not be found.", themeName);
                    return false;
                }
            }
            const filename = Path.join(path, "theme.js");
            if (!FS.existsSync(filename)) {
                this.theme = this.addComponent("theme", new DefaultTheme_1.DefaultTheme(this, path));
            }
            else {
                try {
                    /* eslint-disable */
                    const themeClass = typeof require(filename) === "function"
                        ? require(filename)
                        : require(filename).default;
                    /* eslint-enable */
                    this.theme = this.addComponent("theme", new themeClass(this, path));
                }
                catch (err) {
                    throw new Error(`Exception while loading "${filename}". You must export a \`new Theme(renderer, basePath)\` compatible class.\n` +
                        err);
                }
            }
        }
        this.theme.resources.activate();
        return true;
    }
    /**
     * Prepare the output directory. If the directory does not exist, it will be
     * created. If the directory exists, it will be emptied.
     *
     * @param directory  The path to the directory that should be prepared.
     * @returns TRUE if the directory could be prepared, otherwise FALSE.
     */
    prepareOutputDirectory(directory) {
        if (FS.existsSync(directory)) {
            if (!FS.statSync(directory).isDirectory()) {
                this.application.logger.error('The output target "%s" exists but it is not a directory.', directory);
                return false;
            }
            if (this.disableOutputCheck) {
                return true;
            }
            if (FS.readdirSync(directory).length === 0) {
                return true;
            }
            // Theme must be set as this is only called after the theme is created.
            if (!this.theme.isOutputDirectory(directory)) {
                this.application.logger.error('The output directory "%s" exists but does not seem to be a documentation generated by TypeDoc.\n' +
                    "Make sure this is the right target directory, delete the folder and rerun TypeDoc.", directory);
                return false;
            }
            try {
                FS.removeSync(directory);
            }
            catch (error) {
                this.application.logger.warn("Could not empty the output directory.");
            }
        }
        if (!FS.existsSync(directory)) {
            try {
                FS.mkdirpSync(directory);
            }
            catch (error) {
                this.application.logger.error("Could not create output directory %s", directory);
                return false;
            }
        }
        return true;
    }
    // This exists so that the resources can get the directory
    // without importing this file. Normally, I'd just directly
    // get the path, but typedoc-plugin-markdown overrides the
    // static version, and I don't need to break that yet...
    getDefaultTheme() {
        return Renderer_1.getDefaultTheme();
    }
    /**
     * Return the path containing the themes shipped with TypeDoc.
     *
     * @returns The path to the theme directory.
     */
    static getThemeDirectory() {
        return Path.dirname(require.resolve("typedoc-default-themes"));
    }
    /**
     * Return the path to the default theme.
     *
     * @returns The path to the default theme.
     */
    static getDefaultTheme() {
        return Path.join(Renderer_1.getThemeDirectory(), "default");
    }
};
__decorate([
    utils_1.BindOption("theme")
], Renderer.prototype, "themeName", void 0);
__decorate([
    utils_1.BindOption("disableOutputCheck")
], Renderer.prototype, "disableOutputCheck", void 0);
__decorate([
    utils_1.BindOption("gaID")
], Renderer.prototype, "gaID", void 0);
__decorate([
    utils_1.BindOption("gaSite")
], Renderer.prototype, "gaSite", void 0);
__decorate([
    utils_1.BindOption("hideGenerator")
], Renderer.prototype, "hideGenerator", void 0);
__decorate([
    utils_1.BindOption("toc")
], Renderer.prototype, "toc", void 0);
__decorate([
    utils_1.BindOption("highlightTheme")
], Renderer.prototype, "highlightTheme", void 0);
Renderer = Renderer_1 = __decorate([
    component_1.Component({ name: "renderer", internal: true, childClass: components_1.RendererComponent })
], Renderer);
exports.Renderer = Renderer;
require("./plugins");
