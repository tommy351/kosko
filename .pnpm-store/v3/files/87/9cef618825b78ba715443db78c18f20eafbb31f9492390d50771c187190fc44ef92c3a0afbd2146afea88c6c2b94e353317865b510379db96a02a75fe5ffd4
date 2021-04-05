import * as ts from "typescript";
import { Comment } from "../../models/comments/index";
/**
 * Return the parsed comment of the given TypeScript node.
 *
 * @param node  The node whose comment should be returned.
 * @return The parsed comment as a [[Comment]] instance or undefined if no comment is present.
 */
export declare function createComment(node: ts.Node): Comment | undefined;
/**
 * Return the raw comment string for the given node.
 *
 * @param node  The node whose comment should be resolved.
 * @returns     The raw comment string or undefined if no comment could be found.
 */
export declare function getRawComment(node: ts.Node): string | undefined;
/**
 * Parse the given doc comment string.
 *
 * @param text     The doc comment string that should be parsed.
 * @param comment  The {@link Comment} instance the parsed results should be stored into.
 * @returns        A populated {@link Comment} instance.
 */
export declare function parseComment(text: string, comment?: Comment): Comment;
