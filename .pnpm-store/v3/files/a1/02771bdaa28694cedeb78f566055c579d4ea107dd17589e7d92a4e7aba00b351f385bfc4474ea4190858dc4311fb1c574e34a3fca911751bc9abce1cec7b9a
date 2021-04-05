/**
 * Get the longest directory path common to all files.
 */
export declare function getCommonDirectory(files: readonly string[]): string;
/**
 * Normalize the given path.
 *
 * @param path  The path that should be normalized.
 * @returns The normalized path.
 */
export declare function normalizePath(path: string): string;
/**
 * Test whether the given directory exists.
 *
 * @param directoryPath  The directory that should be tested.
 * @returns TRUE if the given directory exists, FALSE otherwise.
 */
export declare function directoryExists(directoryPath: string): boolean;
/**
 * Make sure that the given directory exists.
 *
 * @param directoryPath  The directory that should be validated.
 */
export declare function ensureDirectoriesExist(directoryPath: string): void;
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
export declare function writeFile(fileName: string, data: string, writeByteOrderMark: boolean, onError?: (message: string) => void): void;
/**
 * Load the given file and return its contents.
 *
 * @param file  The path of the file to read.
 * @returns The files contents.
 */
export declare function readFile(file: string): string;
