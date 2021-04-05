"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerReflection = void 0;
const abstract_1 = require("./abstract");
const lodash_1 = require("lodash");
class ContainerReflection extends abstract_1.Reflection {
    /**
     * Return a list of all children of a certain kind.
     *
     * @param kind  The desired kind of children.
     * @returns     An array containing all children with the desired kind.
     */
    getChildrenByKind(kind) {
        return (this.children || []).filter((child) => child.kindOf(kind));
    }
    /**
     * Traverse all potential child reflections of this reflection.
     *
     * The given callback will be invoked for all children, signatures and type parameters
     * attached to this reflection.
     *
     * @param callback  The callback function that should be applied for each child reflection.
     */
    traverse(callback) {
        for (const child of lodash_1.toArray(this.children)) {
            if (callback(child, abstract_1.TraverseProperty.Children) === false) {
                return;
            }
        }
    }
}
exports.ContainerReflection = ContainerReflection;
