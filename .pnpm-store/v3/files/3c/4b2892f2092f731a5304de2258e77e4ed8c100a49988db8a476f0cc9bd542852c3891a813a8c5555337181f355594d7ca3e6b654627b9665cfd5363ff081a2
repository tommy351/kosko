"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Converter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Converter = void 0;
const ts = require("typescript");
const assert = require("assert");
const path_1 = require("path");
const index_1 = require("../models/index");
const context_1 = require("./context");
const components_1 = require("./components");
const component_1 = require("../utils/component");
const utils_1 = require("../utils");
const types_1 = require("./types");
const converter_events_1 = require("./converter-events");
const symbols_1 = require("./symbols");
const path_2 = require("path");
const fs_1 = require("../utils/fs");
const paths_1 = require("../utils/paths");
const enum_1 = require("../utils/enum");
const symbols_2 = require("./utils/symbols");
/**
 * Compiles source files using TypeScript and converts compiler symbols to reflections.
 */
let Converter = Converter_1 = class Converter extends component_1.ChildableComponent {
    /**
     * Compile the given source files and create a project reflection for them.
     *
     * @param entryPoints the entry points of this program.
     * @param program the program to document that has already been type checked.
     */
    convert(entryPoints, programs) {
        programs = programs instanceof Array ? programs : [programs];
        this.externalPatternCache = void 0;
        const project = new index_1.ProjectReflection(this.name);
        const context = new context_1.Context(this, programs, project);
        this.trigger(Converter_1.EVENT_BEGIN, context);
        this.compile(entryPoints, context);
        this.resolve(context);
        // This should only do anything if a plugin does something bad.
        project.removeDanglingReferences();
        this.trigger(Converter_1.EVENT_END, context);
        return project;
    }
    /** @internal */
    convertSymbol(context, symbol) {
        symbols_1.convertSymbol(context, symbol);
    }
    /**
     * Convert the given TypeScript type into its TypeDoc type reflection.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param referenceTarget The target to be used to attempt to resolve reference types
     * @returns The TypeDoc type reflection representing the given node and type.
     * @internal
     */
    convertType(context, node) {
        return types_1.convertType(context, node);
    }
    /** @internal */
    getNodesForSymbol(symbol, kind) {
        var _a;
        const wantedKinds = {
            [index_1.ReflectionKind.Project]: [ts.SyntaxKind.SourceFile],
            [index_1.ReflectionKind.Module]: [ts.SyntaxKind.SourceFile],
            [index_1.ReflectionKind.Namespace]: [
                ts.SyntaxKind.ModuleDeclaration,
                ts.SyntaxKind.SourceFile,
            ],
            [index_1.ReflectionKind.Enum]: [ts.SyntaxKind.EnumDeclaration],
            [index_1.ReflectionKind.EnumMember]: [ts.SyntaxKind.EnumMember],
            [index_1.ReflectionKind.Variable]: [ts.SyntaxKind.VariableDeclaration],
            [index_1.ReflectionKind.Function]: [
                ts.SyntaxKind.FunctionDeclaration,
                ts.SyntaxKind.VariableDeclaration,
            ],
            [index_1.ReflectionKind.Class]: [ts.SyntaxKind.ClassDeclaration],
            [index_1.ReflectionKind.Interface]: [
                ts.SyntaxKind.InterfaceDeclaration,
                ts.SyntaxKind.JSDocTypedefTag,
            ],
            [index_1.ReflectionKind.Constructor]: [ts.SyntaxKind.Constructor],
            [index_1.ReflectionKind.Property]: [
                ts.SyntaxKind.PropertyDeclaration,
                ts.SyntaxKind.PropertySignature,
                ts.SyntaxKind.JSDocPropertyTag,
            ],
            [index_1.ReflectionKind.Method]: [
                ts.SyntaxKind.MethodDeclaration,
                ts.SyntaxKind.PropertyDeclaration,
                ts.SyntaxKind.PropertySignature,
            ],
            [index_1.ReflectionKind.CallSignature]: [
                ts.SyntaxKind.FunctionDeclaration,
                ts.SyntaxKind.VariableDeclaration,
                ts.SyntaxKind.MethodDeclaration,
                ts.SyntaxKind.MethodDeclaration,
                ts.SyntaxKind.PropertyDeclaration,
                ts.SyntaxKind.PropertySignature,
                ts.SyntaxKind.CallSignature,
            ],
            [index_1.ReflectionKind.IndexSignature]: [ts.SyntaxKind.IndexSignature],
            [index_1.ReflectionKind.ConstructorSignature]: [
                ts.SyntaxKind.ConstructSignature,
            ],
            [index_1.ReflectionKind.Parameter]: [ts.SyntaxKind.Parameter],
            [index_1.ReflectionKind.TypeLiteral]: [ts.SyntaxKind.TypeLiteral],
            [index_1.ReflectionKind.TypeParameter]: [ts.SyntaxKind.TypeParameter],
            [index_1.ReflectionKind.Accessor]: [
                ts.SyntaxKind.GetAccessor,
                ts.SyntaxKind.SetAccessor,
            ],
            [index_1.ReflectionKind.GetSignature]: [ts.SyntaxKind.GetAccessor],
            [index_1.ReflectionKind.SetSignature]: [ts.SyntaxKind.SetAccessor],
            [index_1.ReflectionKind.ObjectLiteral]: [
                ts.SyntaxKind.ObjectLiteralExpression,
            ],
            [index_1.ReflectionKind.TypeAlias]: [
                ts.SyntaxKind.TypeAliasDeclaration,
                ts.SyntaxKind.JSDocTypedefTag,
            ],
            [index_1.ReflectionKind.Event]: [],
            [index_1.ReflectionKind.Reference]: [
                ts.SyntaxKind.NamespaceExport,
                ts.SyntaxKind.ExportSpecifier,
            ],
        }[kind];
        const declarations = (_a = symbol.getDeclarations()) !== null && _a !== void 0 ? _a : [];
        return declarations.filter((d) => wantedKinds.includes(d.kind));
    }
    /**
     * Compile the files within the given context and convert the compiler symbols to reflections.
     *
     * @param context  The context object describing the current state the converter is in.
     * @returns An array containing all errors generated by the TypeScript compiler.
     */
    compile(entryPoints, context) {
        const baseDir = fs_1.getCommonDirectory(entryPoints);
        const entries = [];
        entryLoop: for (const file of entryPoints.map(utils_1.normalizePath)) {
            for (const program of context.programs) {
                const sourceFile = program.getSourceFile(file);
                if (sourceFile) {
                    entries.push({ file, sourceFile, program });
                    continue entryLoop;
                }
            }
            this.application.logger.warn(`Unable to locate entry point: ${file}`);
        }
        for (const entry of entries) {
            context.setActiveProgram(entry.program);
            entry.context = this.convertExports(context, entry.sourceFile, entryPoints, getModuleName(path_1.resolve(entry.file), baseDir));
        }
        for (const { sourceFile, context } of entries) {
            // active program is already set on context
            assert(context);
            this.convertReExports(context, sourceFile);
        }
        context.setActiveProgram(undefined);
    }
    convertExports(context, node, entryPoints, entryName) {
        const symbol = getSymbolForModuleLike(context, node);
        let moduleContext;
        if (entryPoints.length === 1) {
            // Special case for when we're giving a single entry point, we don't need to
            // create modules for each entry. Register the project as this module.
            context.project.registerReflection(context.project, symbol);
            context.trigger(Converter_1.EVENT_CREATE_DECLARATION, context.project, node);
            moduleContext = context;
        }
        else {
            const reflection = context.createDeclarationReflection(index_1.ReflectionKind.Module, symbol, void 0, entryName);
            moduleContext = context.withScope(reflection);
        }
        for (const exp of getExports(context, node, symbol).filter((exp) => isDirectExport(context.resolveAliasedSymbol(exp), node))) {
            symbols_1.convertSymbol(moduleContext, exp);
        }
        return moduleContext;
    }
    convertReExports(moduleContext, node) {
        for (const exp of getExports(moduleContext, node, moduleContext.project.getSymbolFromReflection(moduleContext.scope)).filter((exp) => !isDirectExport(moduleContext.resolveAliasedSymbol(exp), node))) {
            symbols_1.convertSymbol(moduleContext, exp);
        }
    }
    /**
     * Resolve the project within the given context.
     *
     * @param context  The context object describing the current state the converter is in.
     * @returns The final project reflection.
     */
    resolve(context) {
        this.trigger(Converter_1.EVENT_RESOLVE_BEGIN, context);
        const project = context.project;
        for (const reflection of Object.values(project.reflections)) {
            this.trigger(Converter_1.EVENT_RESOLVE, context, reflection);
        }
        this.trigger(Converter_1.EVENT_RESOLVE_END, context);
    }
    /** @internal */
    shouldIgnore(symbol, checker) {
        if (this.excludeNotDocumented &&
            // If the enum is included, we should include members even if not documented.
            !enum_1.hasAllFlags(symbol.flags, ts.SymbolFlags.EnumMember) &&
            symbols_2.resolveAliasedSymbol(symbol, checker).getDocumentationComment(checker).length === 0) {
            return true;
        }
        if (!this.excludeExternals) {
            return false;
        }
        return this.isExternal(symbol);
    }
    /** @internal */
    isExternal(symbol) {
        var _a, _b;
        (_a = this.externalPatternCache) !== null && _a !== void 0 ? _a : (this.externalPatternCache = paths_1.createMinimatch(this.externalPattern));
        for (const node of (_b = symbol.getDeclarations()) !== null && _b !== void 0 ? _b : []) {
            if (this.externalPatternCache.some((p) => p.match(node.getSourceFile().fileName))) {
                return true;
            }
        }
        return false;
    }
};
/**
 * General events
 */
/**
 * Triggered when the converter begins converting a project.
 * The listener should implement [[IConverterCallback]].
 * @event
 */
Converter.EVENT_BEGIN = converter_events_1.ConverterEvents.BEGIN;
/**
 * Triggered when the converter has finished converting a project.
 * The listener should implement [[IConverterCallback]].
 * @event
 */
Converter.EVENT_END = converter_events_1.ConverterEvents.END;
/**
 * Factory events
 */
/**
 * Triggered when the converter has created a declaration reflection.
 * The listener should implement [[IConverterNodeCallback]].
 * @event
 */
Converter.EVENT_CREATE_DECLARATION = converter_events_1.ConverterEvents.CREATE_DECLARATION;
/**
 * Triggered when the converter has created a signature reflection.
 * The listener should implement [[IConverterNodeCallback]].
 * @event
 */
Converter.EVENT_CREATE_SIGNATURE = converter_events_1.ConverterEvents.CREATE_SIGNATURE;
/**
 * Triggered when the converter has created a parameter reflection.
 * The listener should implement [[IConverterNodeCallback]].
 * @event
 */
Converter.EVENT_CREATE_PARAMETER = converter_events_1.ConverterEvents.CREATE_PARAMETER;
/**
 * Triggered when the converter has created a type parameter reflection.
 * The listener should implement [[IConverterNodeCallback]].
 * @event
 */
Converter.EVENT_CREATE_TYPE_PARAMETER = converter_events_1.ConverterEvents.CREATE_TYPE_PARAMETER;
/**
 * Resolve events
 */
/**
 * Triggered when the converter begins resolving a project.
 * The listener should implement [[IConverterCallback]].
 * @event
 */
Converter.EVENT_RESOLVE_BEGIN = converter_events_1.ConverterEvents.RESOLVE_BEGIN;
/**
 * Triggered when the converter resolves a reflection.
 * The listener should implement [[IConverterResolveCallback]].
 * @event
 */
Converter.EVENT_RESOLVE = converter_events_1.ConverterEvents.RESOLVE;
/**
 * Triggered when the converter has finished resolving a project.
 * The listener should implement [[IConverterCallback]].
 * @event
 */
Converter.EVENT_RESOLVE_END = converter_events_1.ConverterEvents.RESOLVE_END;
__decorate([
    utils_1.BindOption("name")
], Converter.prototype, "name", void 0);
__decorate([
    utils_1.BindOption("externalPattern")
], Converter.prototype, "externalPattern", void 0);
__decorate([
    utils_1.BindOption("excludeExternals")
], Converter.prototype, "excludeExternals", void 0);
__decorate([
    utils_1.BindOption("excludeNotDocumented")
], Converter.prototype, "excludeNotDocumented", void 0);
__decorate([
    utils_1.BindOption("excludePrivate")
], Converter.prototype, "excludePrivate", void 0);
__decorate([
    utils_1.BindOption("excludeProtected")
], Converter.prototype, "excludeProtected", void 0);
Converter = Converter_1 = __decorate([
    component_1.Component({
        name: "converter",
        internal: true,
        childClass: components_1.ConverterComponent,
    })
], Converter);
exports.Converter = Converter;
function getModuleName(fileName, baseDir) {
    return utils_1.normalizePath(path_2.relative(baseDir, fileName)).replace(/(\/index)?(\.d)?\.[tj]sx?$/, "");
}
function getSymbolForModuleLike(context, node) {
    var _a, _b;
    const symbol = (_a = context.checker.getSymbolAtLocation(node)) !== null && _a !== void 0 ? _a : node.symbol;
    if (symbol) {
        return symbol;
    }
    // This is a global file, get all symbols declared in this file...
    // this isn't the best solution, it would be nice to have all globals given to a special
    // "globals" file, but this is uncommon enough that I'm skipping it for now.
    const sourceFile = node.getSourceFile();
    const globalSymbols = context.checker
        .getSymbolsInScope(node, ts.SymbolFlags.ModuleMember)
        .filter((s) => { var _a; return (_a = s.getDeclarations()) === null || _a === void 0 ? void 0 : _a.some((d) => d.getSourceFile() === sourceFile); });
    // Detect declaration files with declare module "foo" as their only export
    // and lift that up one level as the source file symbol
    if (globalSymbols.length === 1 &&
        ((_b = globalSymbols[0]
            .getDeclarations()) === null || _b === void 0 ? void 0 : _b.every((declaration) => ts.isModuleDeclaration(declaration) &&
            ts.isStringLiteral(declaration.name)))) {
        return globalSymbols[0];
    }
}
function getExports(context, node, symbol) {
    var _a;
    // The generated docs aren't great, but you really ought not be using
    // this in the first place... so it's better than nothing.
    const exportEq = (_a = symbol === null || symbol === void 0 ? void 0 : symbol.exports) === null || _a === void 0 ? void 0 : _a.get("export=");
    if (exportEq) {
        // JS users might also have exported types here.
        // We need to filter for types because otherwise static methods can show up as both
        // members of the export= class and as functions if a class is directly exported.
        return [exportEq].concat(context.checker
            .getExportsOfModule(symbol)
            .filter((s) => !enum_1.hasAnyFlag(s.flags, ts.SymbolFlags.Prototype | ts.SymbolFlags.Value)));
    }
    if (symbol) {
        return context.checker
            .getExportsOfModule(symbol)
            .filter((s) => !enum_1.hasAllFlags(s.flags, ts.SymbolFlags.Prototype));
    }
    // Global file with no inferred top level symbol, get all symbols declared in this file.
    const sourceFile = node.getSourceFile();
    const globalSymbols = context.checker
        .getSymbolsInScope(node, ts.SymbolFlags.ModuleMember)
        .filter((s) => { var _a; return (_a = s.getDeclarations()) === null || _a === void 0 ? void 0 : _a.some((d) => d.getSourceFile() === sourceFile); });
    return globalSymbols;
}
function isDirectExport(symbol, file) {
    var _a, _b;
    return ((_b = (_a = symbol
        .getDeclarations()) === null || _a === void 0 ? void 0 : _a.every((decl) => decl.getSourceFile() === file)) !== null && _b !== void 0 ? _b : false);
}
