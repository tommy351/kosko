"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclarationReflection = void 0;
const abstract_1 = require("./abstract");
const index_1 = require("../types/index");
const container_1 = require("./container");
const lodash_1 = require("lodash");
/**
 * A reflection that represents a single declaration emitted by the TypeScript compiler.
 *
 * All parts of a project are represented by DeclarationReflection instances. The actual
 * kind of a reflection is stored in its ´kind´ member.
 */
class DeclarationReflection extends container_1.ContainerReflection {
    constructor() {
        super(...arguments);
        /**
         * Flag to determine if this reflection ought to be documented as overwriting another reflection
         * or inheriting from it.
         */
        this._overwrites = false;
    }
    hasGetterOrSetter() {
        return !!this.getSignature || !!this.setSignature;
    }
    getAllSignatures() {
        let result = [];
        if (this.signatures) {
            result = result.concat(this.signatures);
        }
        if (this.indexSignature) {
            result.push(this.indexSignature);
        }
        if (this.getSignature) {
            result.push(this.getSignature);
        }
        if (this.setSignature) {
            result.push(this.setSignature);
        }
        return result;
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
        for (const parameter of lodash_1.toArray(this.typeParameters)) {
            if (callback(parameter, abstract_1.TraverseProperty.TypeParameter) === false) {
                return;
            }
        }
        if (this.type instanceof index_1.ReflectionType) {
            if (callback(this.type.declaration, abstract_1.TraverseProperty.TypeLiteral) === false) {
                return;
            }
        }
        for (const signature of lodash_1.toArray(this.signatures)) {
            if (callback(signature, abstract_1.TraverseProperty.Signatures) === false) {
                return;
            }
        }
        if (this.indexSignature) {
            if (callback(this.indexSignature, abstract_1.TraverseProperty.IndexSignature) === false) {
                return;
            }
        }
        if (this.getSignature) {
            if (callback(this.getSignature, abstract_1.TraverseProperty.GetSignature) ===
                false) {
                return;
            }
        }
        if (this.setSignature) {
            if (callback(this.setSignature, abstract_1.TraverseProperty.SetSignature) ===
                false) {
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
            this.typeParameters.forEach((parameter) => {
                parameters.push(parameter.name);
            });
            result += "<" + parameters.join(", ") + ">";
        }
        if (this.type) {
            result += ":" + this.type.toString();
        }
        return result;
    }
    /** @internal */
    setOverwrites() {
        this._overwrites = true;
    }
    /** @internal */
    getOverwrites() {
        return this._overwrites;
    }
}
exports.DeclarationReflection = DeclarationReflection;
