"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureReflection = void 0;
const index_1 = require("../types/index");
const abstract_1 = require("./abstract");
const lodash_1 = require("lodash");
class SignatureReflection extends abstract_1.Reflection {
    /**
     * Return an array of the parameter types.
     */
    getParameterTypes() {
        if (!this.parameters) {
            return [];
        }
        function notUndefined(t) {
            return !!t;
        }
        return this.parameters
            .map((parameter) => parameter.type)
            .filter(notUndefined);
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
        if (this.type instanceof index_1.ReflectionType) {
            if (callback(this.type.declaration, abstract_1.TraverseProperty.TypeLiteral) === false) {
                return;
            }
        }
        for (const parameter of lodash_1.toArray(this.typeParameters)) {
            if (callback(parameter, abstract_1.TraverseProperty.TypeParameter) === false) {
                return;
            }
        }
        for (const parameter of lodash_1.toArray(this.parameters)) {
            if (callback(parameter, abstract_1.TraverseProperty.Parameters) === false) {
                return;
            }
        }
        super.traverse(callback);
    }
    /**
     * Return a string representation of this reflection.
     */
    toString() {
        let result = super.toString();
        if (this.typeParameters) {
            const parameters = [];
            this.typeParameters.forEach((parameter) => parameters.push(parameter.name));
            result += "<" + parameters.join(", ") + ">";
        }
        if (this.type) {
            result += ":" + this.type.toString();
        }
        return result;
    }
}
exports.SignatureReflection = SignatureReflection;
