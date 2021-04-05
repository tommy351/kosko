import { Type } from "../types/index";
import { Reflection, TypeContainer, TypeParameterContainer, TraverseCallback } from "./abstract";
import { ContainerReflection } from "./container";
import { ParameterReflection } from "./parameter";
import { TypeParameterReflection } from "./type-parameter";
export declare class SignatureReflection extends Reflection implements TypeContainer, TypeParameterContainer {
    parent?: ContainerReflection;
    parameters?: ParameterReflection[];
    typeParameters?: TypeParameterReflection[];
    type?: Type;
    /**
     * A type that points to the reflection that has been overwritten by this reflection.
     *
     * Applies to interface and class members.
     */
    overwrites?: Type;
    /**
     * A type that points to the reflection this reflection has been inherited from.
     *
     * Applies to interface and class members.
     */
    inheritedFrom?: Type;
    /**
     * A type that points to the reflection this reflection is the implementation of.
     *
     * Applies to class members.
     */
    implementationOf?: Type;
    /**
     * Return an array of the parameter types.
     */
    getParameterTypes(): Type[];
    /**
     * Traverse all potential child reflections of this reflection.
     *
     * The given callback will be invoked for all children, signatures and type parameters
     * attached to this reflection.
     *
     * @param callback  The callback function that should be applied for each child reflection.
     */
    traverse(callback: TraverseCallback): void;
    /**
     * Return a string representation of this reflection.
     */
    toString(): string;
}
