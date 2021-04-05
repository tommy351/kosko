import * as Handlebars from 'handlebars';
import { DeclarationReflection, NavigationItem, ProjectReflection, Reflection, Renderer, UrlMapping } from 'typedoc';
import { ReflectionKind } from 'typedoc/dist/lib/models';
import { Theme } from 'typedoc/dist/lib/output/theme';
import { TemplateMapping } from 'typedoc/dist/lib/output/themes/DefaultTheme';
export default class MarkdownTheme extends Theme {
    readme: string;
    entryPoints: string[];
    allReflectionsHaveOwnDocument: boolean;
    filenameSeparator: string;
    entryDocument: string;
    static HANDLEBARS: typeof Handlebars;
    static URL_PREFIX: RegExp;
    static formatContents(contents: string): string;
    constructor(renderer: Renderer, basePath: string);
    isOutputDirectory(outputDirectory: string): boolean;
    allowedDirectoryListings(): string[];
    getUrls(project: ProjectReflection): UrlMapping[];
    buildUrls(reflection: DeclarationReflection, urls: UrlMapping[]): UrlMapping[];
    toUrl(mapping: TemplateMapping, reflection: DeclarationReflection): string;
    getUrl(reflection: Reflection, relative?: Reflection): string;
    applyAnchorUrl(reflection: Reflection, container: Reflection): void;
    toAnchorRef(reflectionId: string): string;
    getNavigation(project: ProjectReflection): NavigationItem;
    private onPageEnd;
    get mappings(): {
        kind: ReflectionKind[];
        isLeaf: boolean;
        directory: string;
        template: string;
    }[];
    get globalsFile(): string;
}
