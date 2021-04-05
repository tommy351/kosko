import * as ts from "typescript";
/**
 * List of known log levels. Used to specify the urgency of a log message.
 */
export declare enum LogLevel {
    Verbose = 0,
    Info = 1,
    Warn = 2,
    Error = 3
}
/**
 * A logger that will not produce any output.
 *
 * This logger also serves as the base class of other loggers as it implements
 * all the required utility functions.
 */
export declare class Logger {
    /**
     * How many error messages have been logged?
     */
    errorCount: number;
    /**
     * How many warning messages have been logged?
     */
    warningCount: number;
    /**
     * The minimum logging level to print.
     */
    level: LogLevel;
    /**
     * Has an error been raised through the log method?
     */
    hasErrors(): boolean;
    /**
     * Has a warning been raised through the log method?
     */
    hasWarnings(): boolean;
    /**
     * Reset the error counter.
     */
    resetErrors(): void;
    /**
     * Reset the warning counter.
     */
    resetWarnings(): void;
    /**
     * Log the given message.
     *
     * @param text  The message that should be logged.
     * @param args  The arguments that should be printed into the given message.
     */
    write(text: string, ...args: string[]): void;
    /**
     * Log the given message with a trailing whitespace.
     *
     * @param text  The message that should be logged.
     * @param args  The arguments that should be printed into the given message.
     */
    writeln(text: string, ...args: string[]): void;
    /**
     * Log the given success message.
     *
     * @param text  The message that should be logged.
     * @param args  The arguments that should be printed into the given message.
     */
    success(text: string, ...args: string[]): void;
    /**
     * Log the given verbose message.
     *
     * @param text  The message that should be logged.
     * @param args  The arguments that should be printed into the given message.
     */
    verbose(text: string, ...args: string[]): void;
    /**
     * Log the given warning.
     *
     * @param text  The warning that should be logged.
     * @param args  The arguments that should be printed into the given warning.
     */
    warn(text: string, ...args: string[]): void;
    /**
     * Log the given error.
     *
     * @param text  The error that should be logged.
     * @param args  The arguments that should be printed into the given error.
     */
    error(text: string, ...args: string[]): void;
    /**
     * Print a log message.
     *
     * @param _message  The message itself.
     * @param level  The urgency of the log message.
     * @param _newLine  Should the logger print a trailing whitespace?
     */
    log(_message: string, level?: LogLevel): void;
    /**
     * Print the given TypeScript log messages.
     *
     * @param diagnostics  The TypeScript messages that should be logged.
     */
    diagnostics(diagnostics: ReadonlyArray<ts.Diagnostic>): void;
    /**
     * Print the given TypeScript log message.
     *
     * @param diagnostic  The TypeScript message that should be logged.
     */
    diagnostic(diagnostic: ts.Diagnostic): void;
}
/**
 * A logger that outputs all messages to the console.
 */
export declare class ConsoleLogger extends Logger {
    /**
     * Print a log message.
     *
     * @param message  The message itself.
     * @param level  The urgency of the log message.
     * @param newLine  Should the logger print a trailing whitespace?
     */
    log(message: string, level?: LogLevel): void;
}
/**
 * A logger that calls a callback function.
 */
export declare class CallbackLogger extends Logger {
    /**
     * This loggers callback function
     */
    callback: Function;
    /**
     * Create a new CallbackLogger instance.
     *
     * @param callback  The callback that should be used to log messages.
     */
    constructor(callback: Function);
    /**
     * Print a log message.
     *
     * @param message  The message itself.
     * @param level  The urgency of the log message.
     * @param newLine  Should the logger print a trailing whitespace?
     */
    log(message: string, level?: LogLevel, newLine?: boolean): void;
}
