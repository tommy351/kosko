import { ContextAwareRendererComponent } from 'typedoc/dist/lib/output/components';
import { RendererEvent } from 'typedoc/dist/lib/output/events';
export declare class Comments extends ContextAwareRendererComponent {
    includes: string;
    mediaDirectory: string;
    listInvalidSymbolLinks: boolean;
    private includePattern;
    private mediaPattern;
    private brackets;
    private inlineTag;
    private warnings;
    initialize(): void;
    parseComments(text: string): string;
    private replaceBrackets;
    private replaceInlineTags;
    private buildLink;
    onEndRenderer(event: RendererEvent): void;
}
