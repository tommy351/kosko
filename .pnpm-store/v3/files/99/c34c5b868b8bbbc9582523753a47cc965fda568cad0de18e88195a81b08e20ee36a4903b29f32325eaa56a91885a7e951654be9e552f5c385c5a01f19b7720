"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginHost = void 0;
const FS = require("fs");
const Path = require("path");
const component_1 = require("./component");
const options_1 = require("./options");
const fs_1 = require("./fs");
/**
 * Responsible for discovering and loading plugins.
 */
let PluginHost = class PluginHost extends component_1.AbstractComponent {
    /**
     * Load all npm plugins.
     * @returns TRUE on success, otherwise FALSE.
     */
    load() {
        const logger = this.application.logger;
        const plugins = this.plugins.length
            ? this.resolvePluginPaths(this.plugins)
            : this.discoverNpmPlugins();
        if (plugins.some((plugin) => plugin.toLowerCase() === "none")) {
            return true;
        }
        for (const plugin of plugins) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const instance = require(plugin);
                const initFunction = typeof instance.load === "function"
                    ? instance.load
                    : instance; // support legacy plugins
                if (typeof initFunction === "function") {
                    initFunction(this);
                    logger.write("Loaded plugin %s", plugin);
                }
                else {
                    logger.error("Invalid structure in plugin %s, no function found.", plugin);
                }
            }
            catch (error) {
                logger.error("The plugin %s could not be loaded.", plugin);
                logger.writeln(error.stack);
                return false;
            }
        }
        return true;
    }
    /**
     * Discover all installed TypeDoc plugins.
     *
     * @returns A list of all npm module names that are qualified TypeDoc plugins.
     */
    discoverNpmPlugins() {
        const result = [];
        const logger = this.application.logger;
        discover();
        return result;
        /**
         * Find all parent folders containing a `node_modules` subdirectory.
         */
        function discover() {
            let path = process.cwd(), previous;
            do {
                const modules = Path.join(path, "node_modules");
                if (FS.existsSync(modules) &&
                    FS.statSync(modules).isDirectory()) {
                    discoverModules(modules);
                }
                previous = path;
                path = Path.resolve(Path.join(previous, ".."));
            } while (previous !== path);
        }
        /**
         * Scan the given `node_modules` directory for TypeDoc plugins.
         */
        function discoverModules(basePath) {
            const candidates = [];
            FS.readdirSync(basePath).forEach((name) => {
                const dir = Path.join(basePath, name);
                if (name.startsWith("@") && FS.statSync(dir).isDirectory()) {
                    FS.readdirSync(dir).forEach((n) => {
                        candidates.push(Path.join(name, n));
                    });
                }
                candidates.push(name);
            });
            candidates.forEach((name) => {
                const infoFile = Path.join(basePath, name, "package.json");
                if (!FS.existsSync(infoFile)) {
                    return;
                }
                const info = loadPackageInfo(infoFile);
                if (isPlugin(info)) {
                    result.push(Path.join(basePath, name));
                }
            });
        }
        /**
         * Load and parse the given `package.json`.
         */
        function loadPackageInfo(fileName) {
            try {
                return JSON.parse(fs_1.readFile(fileName));
            }
            catch (error) {
                logger.error("Could not parse %s", fileName);
                return {};
            }
        }
        /**
         * Test whether the given package info describes a TypeDoc plugin.
         */
        function isPlugin(info) {
            const keywords = info.keywords;
            if (!keywords || !Array.isArray(keywords)) {
                return false;
            }
            for (let i = 0, c = keywords.length; i < c; i++) {
                const keyword = keywords[i];
                if (typeof keyword === "string" &&
                    keyword.toLowerCase() === "typedocplugin") {
                    return true;
                }
            }
            return false;
        }
    }
    /**
     * Resolves plugin paths to absolute paths from the current working directory
     * (`process.cwd()`).
     *
     * ```txt
     * ./plugin   -> resolve
     * ../plugin  -> resolve
     * plugin     -> don't resolve (module resolution)
     * /plugin    -> don't resolve (already absolute path)
     * c:\plugin  -> don't resolve (already absolute path)
     * ```
     *
     * @param plugins
     */
    resolvePluginPaths(plugins) {
        const cwd = process.cwd();
        return plugins.map((plugin) => {
            // treat plugins that start with `.` as relative, requiring resolution
            if (plugin.startsWith(".")) {
                return Path.resolve(cwd, plugin);
            }
            return plugin;
        });
    }
};
__decorate([
    options_1.BindOption("plugin")
], PluginHost.prototype, "plugins", void 0);
PluginHost = __decorate([
    component_1.Component({ name: "plugin-host", internal: true })
], PluginHost);
exports.PluginHost = PluginHost;
