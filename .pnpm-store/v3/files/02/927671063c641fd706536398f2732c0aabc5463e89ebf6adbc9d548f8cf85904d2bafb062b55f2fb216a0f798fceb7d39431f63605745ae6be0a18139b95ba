"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImplementsPlugin = void 0;
const index_1 = require("../../models/reflections/index");
const index_2 = require("../../models/types/index");
const components_1 = require("../components");
const converter_1 = require("../converter");
const array_1 = require("../../utils/array");
const reflections_1 = require("../utils/reflections");
/**
 * A plugin that detects interface implementations of functions and
 * properties on classes and links them.
 */
let ImplementsPlugin = class ImplementsPlugin extends components_1.ConverterComponent {
    /**
     * Create a new ImplementsPlugin instance.
     */
    initialize() {
        this.listenTo(this.owner, converter_1.Converter.EVENT_RESOLVE, this.onResolve, -10);
    }
    /**
     * Mark all members of the given class to be the implementation of the matching interface member.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param classReflection  The reflection of the classReflection class.
     * @param interfaceReflection  The reflection of the interfaceReflection interface.
     */
    analyzeClass(context, classReflection, interfaceReflection) {
        if (!interfaceReflection.children) {
            return;
        }
        interfaceReflection.children.forEach((interfaceMember) => {
            if (!(interfaceMember instanceof index_1.DeclarationReflection)) {
                return;
            }
            let classMember;
            if (!classReflection.children) {
                return;
            }
            for (let index = 0, count = classReflection.children.length; index < count; index++) {
                const child = classReflection.children[index];
                if (child.name !== interfaceMember.name) {
                    continue;
                }
                if (child.flags.isStatic !== interfaceMember.flags.isStatic) {
                    continue;
                }
                classMember = child;
                break;
            }
            if (!classMember) {
                return;
            }
            const interfaceMemberName = interfaceReflection.name + "." + interfaceMember.name;
            classMember.implementationOf = new index_2.ReferenceType(interfaceMemberName, interfaceMember, context.project);
            reflections_1.copyComment(classMember, interfaceMember);
            if (interfaceMember.kindOf(index_1.ReflectionKind.Property) &&
                classMember.kindOf(index_1.ReflectionKind.Accessor)) {
                if (classMember.getSignature) {
                    reflections_1.copyComment(classMember.getSignature, interfaceMember);
                    classMember.getSignature.implementationOf =
                        classMember.implementationOf;
                }
                if (classMember.setSignature) {
                    reflections_1.copyComment(classMember.setSignature, interfaceMember);
                    classMember.setSignature.implementationOf =
                        classMember.implementationOf;
                }
            }
            if (interfaceMember.kindOf(index_1.ReflectionKind.FunctionOrMethod) &&
                interfaceMember.signatures &&
                classMember.signatures) {
                interfaceMember.signatures.forEach((interfaceSignature) => {
                    const interfaceParameters = interfaceSignature.getParameterTypes();
                    (classMember.signatures || []).forEach((classSignature) => {
                        if (index_2.Type.isTypeListEqual(interfaceParameters, classSignature.getParameterTypes())) {
                            classSignature.implementationOf = new index_2.ReferenceType(interfaceMemberName, interfaceSignature, context.project);
                            reflections_1.copyComment(classSignature, interfaceSignature);
                        }
                    });
                });
            }
        });
    }
    analyzeInheritance(context, reflection) {
        var _a, _b, _c, _d, _e, _f;
        const extendedTypes = ((_b = (_a = reflection.extendedTypes) === null || _a === void 0 ? void 0 : _a.filter((type) => {
            return (type instanceof index_2.ReferenceType &&
                type.reflection instanceof index_1.DeclarationReflection);
        })) !== null && _b !== void 0 ? _b : []);
        for (const parent of extendedTypes) {
            for (const parentMember of (_c = parent.reflection.children) !== null && _c !== void 0 ? _c : []) {
                const child = (_d = reflection.children) === null || _d === void 0 ? void 0 : _d.find((child) => child.name == parentMember.name &&
                    child.flags.isStatic === parentMember.flags.isStatic);
                if (child) {
                    const key = child.getOverwrites()
                        ? "overwrites"
                        : "inheritedFrom";
                    for (const [childSig, parentSig] of array_1.zip((_e = child.signatures) !== null && _e !== void 0 ? _e : [], (_f = parentMember.signatures) !== null && _f !== void 0 ? _f : [])) {
                        childSig[key] = new index_2.ReferenceType(`${parent.name}.${parentMember.name}`, parentSig, context.project);
                    }
                    child[key] = new index_2.ReferenceType(`${parent.name}.${parentMember.name}`, parentMember, context.project);
                    reflections_1.copyComment(child, parentMember);
                }
            }
        }
    }
    /**
     * Triggered when the converter resolves a reflection.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param reflection  The reflection that is currently resolved.
     */
    onResolve(context, reflection) {
        if (reflection.kindOf(index_1.ReflectionKind.Class) &&
            reflection.implementedTypes) {
            reflection.implementedTypes.forEach((type) => {
                if (!(type instanceof index_2.ReferenceType)) {
                    return;
                }
                if (type.reflection &&
                    type.reflection.kindOf(index_1.ReflectionKind.Interface)) {
                    this.analyzeClass(context, reflection, type.reflection);
                }
            });
        }
        if (reflection.kindOf([
            index_1.ReflectionKind.Class,
            index_1.ReflectionKind.Interface,
        ]) &&
            reflection.extendedTypes) {
            this.analyzeInheritance(context, reflection);
        }
    }
};
ImplementsPlugin = __decorate([
    components_1.Component({ name: "implements" })
], ImplementsPlugin);
exports.ImplementsPlugin = ImplementsPlugin;
