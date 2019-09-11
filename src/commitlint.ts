import * as core from '@actions/core';
import * as cli from '@actions/exec';
import * as io from '@actions/io';
import * as fs from 'fs';
import * as path from 'path';

const FOLDER = process.env['GITHUB_WORKSPACE'] || '';
const BINARY = 'commitlint';

export interface Config {
	/** Path to the config file */
	config?: string;
	/** Shareable configuration to extend */
	extends?: string;
	/** Lower end of the commit range to lint  */
	from?: string;
	/** Upper end of the commit range to lint  */
	to?: string;
}

/**
 * Find the locally installed Commitlint, or add it from this project.
 * If it isn't installed, adds the shipped Commitlint to the global path.
 * Eventually it returns the absolute path to the Commitlint binary.
 */
export function install() {
	const local = path.join(FOLDER, 'node_modules', '.bin', BINARY);

	if (fs.existsSync(local)) {
		return local;
	}

	core.addPath(path.join(__dirname, '..', 'node_modules', '.bin'));
	return io.which(BINARY);
}

/**
 * Execute Commitlint with the provided configuration.
 * It will transform this configuration to CLI parameters.
 */
export async function run(commitlint: string, config: Config) {
	const parameters = Object.entries(config)
		.map(([key, value]) => value ? `--${key}=${value}` : '')
		.filter(Boolean);

	return cli.exec(commitlint, parameters, { cwd: FOLDER });
}
