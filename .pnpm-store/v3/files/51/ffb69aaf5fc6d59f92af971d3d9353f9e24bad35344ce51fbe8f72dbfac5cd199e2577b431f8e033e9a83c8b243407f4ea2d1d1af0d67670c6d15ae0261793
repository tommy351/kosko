import { ConverterComponent } from "../components";
/**
 * A plugin that detects interface implementations of functions and
 * properties on classes and links them.
 */
export declare class ImplementsPlugin extends ConverterComponent {
    /**
     * Create a new ImplementsPlugin instance.
     */
    initialize(): void;
    /**
     * Mark all members of the given class to be the implementation of the matching interface member.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param classReflection  The reflection of the classReflection class.
     * @param interfaceReflection  The reflection of the interfaceReflection interface.
     */
    private analyzeClass;
    private analyzeInheritance;
    /**
     * Triggered when the converter resolves a reflection.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param reflection  The reflection that is currently resolved.
     */
    private onResolve;
}
