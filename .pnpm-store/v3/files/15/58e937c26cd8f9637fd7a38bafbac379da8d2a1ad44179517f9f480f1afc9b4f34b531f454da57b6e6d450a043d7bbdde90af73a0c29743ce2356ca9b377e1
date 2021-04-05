"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const rxjs_1 = require("rxjs");
const stream_1 = require("stream");
const listr_interface_1 = require("../interfaces/listr.interface");
const state_constants_1 = require("../interfaces/state.constants");
const index_1 = require("../index");
const renderer_1 = require("../utils/renderer");
const uuid_1 = require("../utils/uuid");
/**
 * Create a task from the given set of variables and make it runnable.
 */
class Task extends rxjs_1.Subject {
    constructor(listr, tasks, options, rendererOptions) {
        var _a, _b, _c, _d;
        super();
        this.listr = listr;
        this.tasks = tasks;
        this.options = options;
        this.rendererOptions = rendererOptions;
        this.message = {};
        // this kind of randomness is enough for task ids
        this.id = uuid_1.generateUUID();
        this.title = (_a = this.tasks) === null || _a === void 0 ? void 0 : _a.title;
        this.initialTitle = (_b = this.tasks) === null || _b === void 0 ? void 0 : _b.title;
        this.task = this.tasks.task;
        // parse functions
        this.skip = ((_c = this.tasks) === null || _c === void 0 ? void 0 : _c.skip) || (() => false);
        this.enabledFn = ((_d = this.tasks) === null || _d === void 0 ? void 0 : _d.enabled) || (() => true);
        // task options
        this.rendererTaskOptions = this.tasks.options;
        this.renderHook$ = this.listr.renderHook$;
        this.subscribe(() => {
            this.renderHook$.next();
        });
    }
    set state$(state) {
        this.state = state;
        this.next({
            type: 'STATE',
            data: state
        });
        // cancel the subtasks if this has already failed
        if (this.hasSubtasks() && this.hasFailed()) {
            for (const subtask of this.subtasks) {
                if (subtask.state === state_constants_1.StateConstants.PENDING) {
                    subtask.state$ = state_constants_1.StateConstants.FAILED;
                }
            }
        }
    }
    set output$(data) {
        this.output = data;
        this.next({
            type: 'DATA',
            data
        });
    }
    set message$(data) {
        this.message = { ...this.message, ...data };
        this.next({
            type: 'MESSAGE',
            data
        });
    }
    set title$(title) {
        this.title = title;
        this.next({
            type: 'TITLE',
            data: title
        });
    }
    async check(ctx) {
        // Check if a task is enabled or disabled
        if (this.state === undefined) {
            if (typeof this.enabledFn === 'function') {
                this.enabled = await this.enabledFn(ctx);
            } /* istanbul ignore next */
            else {
                this.enabled = this.enabledFn;
            }
            this.next({
                type: 'ENABLED',
                data: this.enabled
            });
        }
    }
    hasSubtasks() {
        var _a;
        return ((_a = this.subtasks) === null || _a === void 0 ? void 0 : _a.length) > 0;
    }
    isPending() {
        return this.state === state_constants_1.StateConstants.PENDING;
    }
    isSkipped() {
        return this.state === state_constants_1.StateConstants.SKIPPED;
    }
    isCompleted() {
        return this.state === state_constants_1.StateConstants.COMPLETED;
    }
    hasFailed() {
        return this.state === state_constants_1.StateConstants.FAILED;
    }
    isRollingBack() {
        return this.state === state_constants_1.StateConstants.ROLLING_BACK;
    }
    hasRolledBack() {
        return this.state === state_constants_1.StateConstants.ROLLED_BACK;
    }
    isRetrying() {
        return this.state === state_constants_1.StateConstants.RETRY;
    }
    isEnabled() {
        return this.enabled;
    }
    hasTitle() {
        return typeof (this === null || this === void 0 ? void 0 : this.title) === 'string';
    }
    isPrompt() {
        if (this.prompt) {
            return true;
        }
        else {
            return false;
        }
    }
    async run(context, wrapper) {
        var _a, _b, _c, _d;
        const handleResult = (result) => {
            if (result instanceof index_1.Listr) {
                // Detect the subtask
                // assign options
                result.options = { ...this.options, ...result.options };
                // switch to silent renderer since already rendering
                const rendererClass = renderer_1.getRenderer('silent');
                result.rendererClass = rendererClass.renderer;
                result.renderHook$.subscribe(() => {
                    this.renderHook$.next();
                });
                // assign subtasks
                this.subtasks = result.tasks;
                this.next({ type: 'SUBTASK' });
                result = result.run(context);
                // eslint-disable-next-line no-empty
            }
            else if (this.isPrompt()) {
                // do nothing, it is already being handled
            }
            else if (result instanceof Promise) {
                // Detect promise
                result = result.then(handleResult);
            }
            else if (result instanceof stream_1.Readable) {
                // Detect stream
                result = new Promise((resolve, reject) => {
                    result.on('data', (data) => {
                        this.output$ = data.toString();
                    });
                    result.on('error', (error) => reject(error));
                    result.on('end', () => resolve(null));
                });
            }
            else if (result instanceof rxjs_1.Observable) {
                // Detect Observable
                result = new Promise((resolve, reject) => {
                    result.subscribe({
                        next: (data) => {
                            this.output$ = data;
                        },
                        error: reject,
                        complete: resolve
                    });
                });
            }
            return result;
        };
        const startTime = Date.now();
        // finish the task first
        this.state$ = state_constants_1.StateConstants.PENDING;
        // check if this function wants to be skipped
        let skipped;
        if (typeof this.skip === 'function') {
            skipped = await this.skip(context);
        }
        if (skipped) {
            if (typeof skipped === 'string') {
                this.message$ = { skip: skipped };
            }
            else if (this.hasTitle()) {
                this.message$ = { skip: this.title };
            }
            else {
                this.message$ = { skip: 'Skipped task without a title.' };
            }
            this.state$ = state_constants_1.StateConstants.SKIPPED;
            return;
        }
        try {
            // add retry functionality
            const retryCount = ((_a = this.tasks) === null || _a === void 0 ? void 0 : _a.retry) && ((_b = this.tasks) === null || _b === void 0 ? void 0 : _b.retry) > 0 ? this.tasks.retry + 1 : 1;
            for (let retries = 1; retries <= retryCount; retries++) {
                try {
                    // handle the results
                    await handleResult(this.task(context, wrapper));
                }
                catch (e) {
                    if (retries !== retryCount) {
                        this.retry = { count: retries, withError: e };
                        this.message$ = { retry: this.retry };
                        this.title$ = this.initialTitle;
                        this.output$ = undefined;
                        wrapper.report(e);
                        this.state$ = state_constants_1.StateConstants.RETRY;
                    }
                    else {
                        throw e;
                    }
                }
            }
            if (this.isPending() || this.isRetrying()) {
                this.message$ = { duration: Date.now() - startTime };
                this.state$ = state_constants_1.StateConstants.COMPLETED;
            }
        }
        catch (error) {
            // catch prompt error, this was the best i could do without going crazy
            if (this.prompt instanceof listr_interface_1.PromptError) {
                // eslint-disable-next-line no-ex-assign
                error = new Error(this.prompt.message);
            }
            // execute the task on error function
            if ((_c = this.tasks) === null || _c === void 0 ? void 0 : _c.rollback) {
                wrapper.report(error);
                try {
                    this.state$ = state_constants_1.StateConstants.ROLLING_BACK;
                    await this.tasks.rollback(context, wrapper);
                    this.state$ = state_constants_1.StateConstants.ROLLED_BACK;
                    this.message$ = { rollback: this.title };
                }
                catch (err) {
                    this.state$ = state_constants_1.StateConstants.FAILED;
                    wrapper.report(err);
                    throw error;
                }
                if (((_d = this.listr.options) === null || _d === void 0 ? void 0 : _d.exitAfterRollback) !== false) {
                    // Do not exit when explicitely set to `false`
                    throw new Error(this.title);
                }
            }
            else {
                /* istanbul ignore if */
                if (error instanceof listr_interface_1.ListrError) {
                    return;
                }
                // mark task as failed
                this.state$ = state_constants_1.StateConstants.FAILED;
                // report error
                wrapper.report(error);
                if (this.listr.options.exitOnError !== false) {
                    // Do not exit when explicitely set to `false`
                    throw error;
                }
            }
        }
        finally {
            // Mark the observable as completed
            this.complete();
        }
    }
}
exports.Task = Task;
