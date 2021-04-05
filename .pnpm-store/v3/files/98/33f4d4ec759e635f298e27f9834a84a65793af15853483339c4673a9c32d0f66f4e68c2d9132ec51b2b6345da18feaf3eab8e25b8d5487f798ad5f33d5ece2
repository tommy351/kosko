"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = exports.ParameterType = exports.ParameterHint = void 0;
var ParameterHint;
(function (ParameterHint) {
    ParameterHint[ParameterHint["File"] = 0] = "File";
    ParameterHint[ParameterHint["Directory"] = 1] = "Directory";
})(ParameterHint = exports.ParameterHint || (exports.ParameterHint = {}));
var ParameterType;
(function (ParameterType) {
    ParameterType[ParameterType["String"] = 0] = "String";
    ParameterType[ParameterType["Number"] = 1] = "Number";
    ParameterType[ParameterType["Boolean"] = 2] = "Boolean";
    ParameterType[ParameterType["Map"] = 3] = "Map";
    ParameterType[ParameterType["Mixed"] = 4] = "Mixed";
    ParameterType[ParameterType["Array"] = 5] = "Array";
})(ParameterType = exports.ParameterType || (exports.ParameterType = {}));
function convert(value, option) {
    var _a;
    switch (option.type) {
        case undefined:
        case ParameterType.String: {
            const stringValue = value == null ? "" : String(value);
            if (option.validate) {
                option.validate(stringValue);
            }
            return stringValue;
        }
        case ParameterType.Number: {
            const numValue = parseInt(String(value), 10) || 0;
            if (!valueIsWithinBounds(numValue, option.minValue, option.maxValue)) {
                throw new Error(getBoundsError(option.name, option.minValue, option.maxValue));
            }
            if (option.validate) {
                option.validate(numValue);
            }
            return numValue;
        }
        case ParameterType.Boolean:
            return Boolean(value);
        case ParameterType.Array: {
            let strArrValue = new Array();
            if (Array.isArray(value)) {
                strArrValue = value.map(String);
            }
            else if (typeof value === "string") {
                strArrValue = value.split(",");
            }
            if (option.validate) {
                option.validate(strArrValue);
            }
            return strArrValue;
        }
        case ParameterType.Map: {
            const key = String(value).toLowerCase();
            if (option.map instanceof Map) {
                if (option.map.has(key)) {
                    return option.map.get(key);
                }
                else if ([...option.map.values()].includes(value)) {
                    return value;
                }
            }
            else if (key in option.map) {
                return option.map[key];
            }
            else if (Object.values(option.map).includes(value)) {
                return value;
            }
            throw new Error((_a = option.mapError) !== null && _a !== void 0 ? _a : getMapError(option.map, option.name));
        }
        case ParameterType.Mixed:
            if (option.validate) {
                option.validate(value);
            }
            return value;
    }
}
exports.convert = convert;
/**
 * Returns an error message for a map option, indicating that a given value was not one of the values within the map.
 * @param map The values for the option.
 * @param name The name of the option.
 * @returns The error message.
 */
function getMapError(map, name) {
    let keys = map instanceof Map ? [...map.keys()] : Object.keys(map);
    const getString = (key) => String(map instanceof Map ? map.get(key) : map[key]);
    // If the map is a TS numeric enum we need to filter out the numeric keys.
    // TS numeric enums have the property that every key maps to a value, which maps back to that key.
    if (!(map instanceof Map) &&
        keys.every((key) => getString(getString(key)) === key)) {
        // This works because TS enum keys may not be numeric.
        keys = keys.filter((key) => Number.isNaN(parseInt(key, 10)));
    }
    return `${name} must be one of ${keys.join(", ")}`;
}
/**
 * Returns an error message for a value that is out of bounds of the given min and/or max values.
 * @param name The name of the thing the value represents.
 * @param minValue The lower bound of the range of allowed values.
 * @param maxValue The upper bound of the range of allowed values.
 * @returns The error message.
 */
function getBoundsError(name, minValue, maxValue) {
    if (isFiniteNumber(minValue) && isFiniteNumber(maxValue)) {
        return `${name} must be between ${minValue} and ${maxValue}`;
    }
    else if (isFiniteNumber(minValue)) {
        return `${name} must be >= ${minValue}`;
    }
    else if (isFiniteNumber(maxValue)) {
        return `${name} must be <= ${maxValue}`;
    }
    throw new Error("Unreachable");
}
/**
 * Checks if the given value is a finite number.
 * @param value The value being checked.
 * @returns True, if the value is a finite number, otherwise false.
 */
function isFiniteNumber(value) {
    return Number.isFinite(value);
}
/**
 * Checks if a value is between the bounds of the given min and/or max values.
 * @param value The value being checked.
 * @param minValue The lower bound of the range of allowed values.
 * @param maxValue The upper bound of the range of allowed values.
 * @returns True, if the value is within the given bounds, otherwise false.
 */
function valueIsWithinBounds(value, minValue, maxValue) {
    if (isFiniteNumber(minValue) && isFiniteNumber(maxValue)) {
        return minValue <= value && value <= maxValue;
    }
    else if (isFiniteNumber(minValue)) {
        return minValue <= value;
    }
    else if (isFiniteNumber(maxValue)) {
        return value <= maxValue;
    }
    else {
        return true;
    }
}
