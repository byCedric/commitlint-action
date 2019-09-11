"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const cli = require("@actions/exec");
const io = require("@actions/io");
const fs = require("fs");
const path = require("path");
const FOLDER = process.env['GITHUB_WORKSPACE'] || '';
const BINARY = 'commitlint';
/**
 * Find the locally installed Commitlint, or add it from this project.
 * If it isn't installed, adds the shipped Commitlint to the global path.
 * Eventually it returns the absolute path to the Commitlint binary.
 */
function install() {
    const local = path.join(FOLDER, 'node_modules', '.bin', BINARY);
    if (fs.existsSync(local)) {
        return local;
    }
    core.addPath(path.join(__dirname, '..', 'node_modules', '.bin'));
    return io.which(BINARY);
}
exports.install = install;
/**
 * Execute Commitlint with the provided configuration.
 * It will transform this configuration to CLI parameters.
 */
function run(commitlint, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const parameters = Object.entries(config)
            .map(([key, value]) => value ? `--${key}=${value}` : '')
            .filter(Boolean);
        return cli.exec(commitlint, parameters, { cwd: FOLDER });
    });
}
exports.run = run;
