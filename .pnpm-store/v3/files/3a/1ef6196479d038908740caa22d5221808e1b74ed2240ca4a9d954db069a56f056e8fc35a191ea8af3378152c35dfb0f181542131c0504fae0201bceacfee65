"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = exports.writeFile = exports.ensureDirectoriesExist = exports.directoryExists = exports.normalizePath = exports.getCommonDirectory = void 0;
const ts = require("typescript");
const FS = require("fs");
const path_1 = require("path");
/**
 * Get the longest directory path common to all files.
 */
function getCommonDirectory(files) {
    if (!files.length) {
        return "";
    }
    const roots = files.map((f) => f.split(/\\|\//));
    if (roots.length === 1) {
        return roots[0].slice(0, -1).join("/");
    }
    let i = 0;
    while (new Set(roots.map((part) => part[i])).size === 1) {
        i++;
    }
    return roots[0].slice(0, i).join("/");
}
exports.getCommonDirectory = getCommonDirectory;
/**
 * List of known existent directories. Used to speed up [[directoryExists]].
 */
const existingDirectories = new Set();
/**
 * Normalize the given path.
 *
 * @param path  The path that should be normalized.
 * @returns The normalized path.
 */
function normalizePath(path) {
    return path.replace(/\\/g, "/");
}
exports.normalizePath = normalizePath;
/**
 * Test whether the given directory exists.
 *
 * @param directoryPath  The directory that should be tested.
 * @returns TRUE if the given directory exists, FALSE otherwise.
 */
function directoryExists(directoryPath) {
    if (existingDirectories.has(directoryPath)) {
        return true;
    }
    if (ts.sys.directoryExists(directoryPath)) {
        existingDirectories.add(directoryPath);
        return true;
    }
    return false;
}
exports.directoryExists = directoryExists;
/**
 * Make sure that the given directory exists.
 *
 * @param directoryPath  The directory that should be validated.
 */
function ensureDirectoriesExist(directoryPath) {
    if (!directoryExists(directoryPath)) {
        const parentDirectory = path_1.dirname(directoryPath);
        ensureDirectoriesExist(parentDirectory);
        ts.sys.createDirectory(directoryPath);
    }
}
exports.ensureDirectoriesExist = ensureDirectoriesExist;
/**
 * Write a file to disc.
 *
 * If the containing directory does not exist it will be created.
 *
 * @param fileName  The name of the file that should be written.
 * @param data  The contents of the file.
 * @param writeByteOrderMark  Whether the UTF-8 BOM should be written or not.
 * @param onError  A callback that will be invoked if an error occurs.
 */
function writeFile(fileName, data, writeByteOrderMark, onError) {
    try {
        ensureDirectoriesExist(path_1.dirname(normalizePath(fileName)));
        ts.sys.writeFile(fileName, data, writeByteOrderMark);
    }
    catch (e) {
        if (onError) {
            onError(e.message);
        }
    }
}
exports.writeFile = writeFile;
/**
 * Load the given file and return its contents.
 *
 * @param file  The path of the file to read.
 * @returns The files contents.
 */
function readFile(file) {
    const buffer = FS.readFileSync(file);
    switch (buffer[0]) {
        case 0xfe:
            if (buffer[1] === 0xff) {
                let i = 0;
                while (i + 1 < buffer.length) {
                    const temp = buffer[i];
                    buffer[i] = buffer[i + 1];
                    buffer[i + 1] = temp;
                    i += 2;
                }
                return buffer.toString("ucs2", 2);
            }
            break;
        case 0xff:
            if (buffer[1] === 0xfe) {
                return buffer.toString("ucs2", 2);
            }
            break;
        case 0xef:
            if (buffer[1] === 0xbb) {
                return buffer.toString("utf8", 3);
            }
    }
    return buffer.toString("utf8", 0);
}
exports.readFile = readFile;
