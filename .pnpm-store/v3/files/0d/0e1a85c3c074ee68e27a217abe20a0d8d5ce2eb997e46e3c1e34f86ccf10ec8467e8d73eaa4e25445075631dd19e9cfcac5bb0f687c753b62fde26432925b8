import { Application } from "../application";
import { AbstractComponent } from "./component";
/**
 * Responsible for discovering and loading plugins.
 */
export declare class PluginHost extends AbstractComponent<Application> {
    plugins: string[];
    /**
     * Load all npm plugins.
     * @returns TRUE on success, otherwise FALSE.
     */
    load(): boolean;
    /**
     * Discover all installed TypeDoc plugins.
     *
     * @returns A list of all npm module names that are qualified TypeDoc plugins.
     */
    private discoverNpmPlugins;
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
    private resolvePluginPaths;
}
