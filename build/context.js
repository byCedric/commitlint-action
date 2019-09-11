"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
/**
 * Determine the path of the configuration.
 * It uses the `config` input, if defined.
 */
function config() {
    return { config: core.getInput('config') || undefined };
}
exports.config = config;
/**
 * Determine the range of commits to lint.
 * It uses multiple tactics to determine the best possible commit range.
 * This is the order it uses to determine the range.
 *   1. use `from` and `to` input
 *   2. use `GITHUB_HEAD_REF` and `GITHUB_BASE_REF` environment variables
 *   3. use `GITHUB_SHA` environment variable
 *   4. use `GITHUB_REF` environment variable
 *   3. use fallback to `HEAD`
 */
function range() {
    if (core.getInput('from') || core.getInput('to')) {
        return {
            from: core.getInput('from') || undefined,
            to: core.getInput('to') || undefined,
        };
    }
    if (process.env['GITHUB_HEAD_REF'] || process.env['GITHUB_BASE_REF']) {
        return {
            from: process.env['GITHUB_HEAD_REF'] || undefined,
            to: process.env['GITHUB_BASE_REF'] || undefined,
        };
    }
    if (process.env['GITHUB_SHA']) {
        return { from: undefined, to: process.env['GITHUB_SHA'] };
    }
    if (process.env['GITHUB_REF']) {
        return { from: undefined, to: process.env['GITHUB_REF'] };
    }
    return { from: undefined, to: 'HEAD' };
}
exports.range = range;
