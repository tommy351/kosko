"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallbackLogger = exports.ConsoleLogger = exports.Logger = exports.LogLevel = void 0;
const ts = require("typescript");
const Util = require("util");
const inspector_1 = require("inspector");
const path_1 = require("path");
const safe_1 = require("colors/safe");
const isDebugging = () => Boolean(inspector_1.url());
/**
 * List of known log levels. Used to specify the urgency of a log message.
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Verbose"] = 0] = "Verbose";
    LogLevel[LogLevel["Info"] = 1] = "Info";
    LogLevel[LogLevel["Warn"] = 2] = "Warn";
    LogLevel[LogLevel["Error"] = 3] = "Error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/**
 * A logger that will not produce any output.
 *
 * This logger also serves as the base class of other loggers as it implements
 * all the required utility functions.
 */
class Logger {
    constructor() {
        /**
         * How many error messages have been logged?
         */
        this.errorCount = 0;
        /**
         * How many warning messages have been logged?
         */
        this.warningCount = 0;
        /**
         * The minimum logging level to print.
         */
        this.level = LogLevel.Info;
    }
    /**
     * Has an error been raised through the log method?
     */
    hasErrors() {
        return this.errorCount > 0;
    }
    /**
     * Has a warning been raised through the log method?
     */
    hasWarnings() {
        return this.warningCount > 0;
    }
    /**
     * Reset the error counter.
     */
    resetErrors() {
        this.errorCount = 0;
    }
    /**
     * Reset the warning counter.
     */
    resetWarnings() {
        this.warningCount = 0;
    }
    /**
     * Log the given message.
     *
     * @param text  The message that should be logged.
     * @param args  The arguments that should be printed into the given message.
     */
    write(text, ...args) {
        this.log(Util.format(text, ...args), LogLevel.Info);
    }
    /**
     * Log the given message with a trailing whitespace.
     *
     * @param text  The message that should be logged.
     * @param args  The arguments that should be printed into the given message.
     */
    writeln(text, ...args) {
        this.log(Util.format(text, ...args), LogLevel.Info);
    }
    /**
     * Log the given success message.
     *
     * @param text  The message that should be logged.
     * @param args  The arguments that should be printed into the given message.
     */
    success(text, ...args) {
        this.log(Util.format(text, ...args), LogLevel.Info);
    }
    /**
     * Log the given verbose message.
     *
     * @param text  The message that should be logged.
     * @param args  The arguments that should be printed into the given message.
     */
    verbose(text, ...args) {
        this.log(Util.format(text, ...args), LogLevel.Verbose);
    }
    /**
     * Log the given warning.
     *
     * @param text  The warning that should be logged.
     * @param args  The arguments that should be printed into the given warning.
     */
    warn(text, ...args) {
        this.log(Util.format(text, ...args), LogLevel.Warn);
    }
    /**
     * Log the given error.
     *
     * @param text  The error that should be logged.
     * @param args  The arguments that should be printed into the given error.
     */
    error(text, ...args) {
        this.log(Util.format(text, ...args), LogLevel.Error);
    }
    /**
     * Print a log message.
     *
     * @param _message  The message itself.
     * @param level  The urgency of the log message.
     * @param _newLine  Should the logger print a trailing whitespace?
     */
    log(_message, level = LogLevel.Info) {
        if (level === LogLevel.Error) {
            this.errorCount += 1;
        }
        if (level === LogLevel.Warn) {
            this.warningCount += 1;
        }
    }
    /**
     * Print the given TypeScript log messages.
     *
     * @param diagnostics  The TypeScript messages that should be logged.
     */
    diagnostics(diagnostics) {
        diagnostics.forEach((diagnostic) => {
            this.diagnostic(diagnostic);
        });
    }
    /**
     * Print the given TypeScript log message.
     *
     * @param diagnostic  The TypeScript message that should be logged.
     */
    diagnostic(diagnostic) {
        const output = ts.formatDiagnosticsWithColorAndContext([diagnostic], {
            getCanonicalFileName: path_1.resolve,
            getCurrentDirectory: () => process.cwd(),
            getNewLine: () => ts.sys.newLine,
        });
        switch (diagnostic.category) {
            case ts.DiagnosticCategory.Error:
                this.log(output, LogLevel.Error);
                break;
            case ts.DiagnosticCategory.Warning:
                this.log(output, LogLevel.Warn);
                break;
            case ts.DiagnosticCategory.Message:
                this.log(output, LogLevel.Info);
        }
    }
}
exports.Logger = Logger;
/**
 * A logger that outputs all messages to the console.
 */
class ConsoleLogger extends Logger {
    /**
     * Print a log message.
     *
     * @param message  The message itself.
     * @param level  The urgency of the log message.
     * @param newLine  Should the logger print a trailing whitespace?
     */
    log(message, level = LogLevel.Info) {
        super.log(message, level);
        if (level < this.level && !isDebugging()) {
            return;
        }
        const output = {
            [LogLevel.Error]: safe_1.red("Error: "),
            [LogLevel.Warn]: safe_1.yellow("Warning: "),
            [LogLevel.Info]: safe_1.cyan("Info: "),
            [LogLevel.Verbose]: safe_1.gray("Debug: "),
        }[level] + message;
        ts.sys.write(output + ts.sys.newLine);
    }
}
exports.ConsoleLogger = ConsoleLogger;
/**
 * A logger that calls a callback function.
 */
class CallbackLogger extends Logger {
    /**
     * Create a new CallbackLogger instance.
     *
     * @param callback  The callback that should be used to log messages.
     */
    constructor(callback) {
        super();
        this.callback = callback;
    }
    /**
     * Print a log message.
     *
     * @param message  The message itself.
     * @param level  The urgency of the log message.
     * @param newLine  Should the logger print a trailing whitespace?
     */
    log(message, level = LogLevel.Info, newLine) {
        super.log(message, level);
        this.callback(message, level, newLine);
    }
}
exports.CallbackLogger = CallbackLogger;
