const FOLDER = process.env['GITHUB_WORKSPACE'] = '/workspace';
const core = { addPath: jest.fn() };
const cli = { exec: jest.fn() };
const fs = { existsSync: jest.fn() };
const io = { which: jest.fn() };

jest.mock('@actions/core', () => core);
jest.mock('@actions/exec', () => cli);
jest.mock('@actions/io', () => io);
jest.mock('fs', () => fs);

import * as commitlint from '../src/commitlint';
import * as path from 'path';

describe('install', () => {
	test('resolves project-installed commitlint', async () => {
		const projectPath = path.join(FOLDER, 'node_modules', '.bin', 'commitlint');
		fs.existsSync.mockReturnValue(true);
		expect(await commitlint.install()).toBe(projectPath);
		expect(fs.existsSync).toBeCalledWith(projectPath);
	});

	test('resolves action-installed commitlint', async () => {
		const actionPath = path.join(__dirname, '..', 'node_modules', '.bin');
		const actionBin = path.join(actionPath, 'commitlint');
		fs.existsSync.mockReturnValue(false);
		io.which.mockResolvedValue(actionBin);
		expect(await commitlint.install()).toBe(actionBin);
		expect(core.addPath).toBeCalledWith(actionPath);
		expect(io.which).toBeCalledWith('commitlint');
	});
});

describe('run', () => {
	test('executes provided commitlint binary', async () => {
		await commitlint.run('/path/to/commitlint', {});
		expect(cli.exec).toBeCalledWith('/path/to/commitlint', [], { cwd: FOLDER });
	});

	test('combines config as cli parameters', async () => {
		await commitlint.run('commitlint', { from: 'source', to: 'target' });
		expect(cli.exec).toBeCalledWith('commitlint', ['--from=source', '--to=target'], { cwd: FOLDER });
	});

	test('filters empty config values from cli parameters', async () => {
		await commitlint.run('commitlint', { from: '', to: 'target', config: '' });
		expect(cli.exec).toBeCalledWith('commitlint', ['--to=target'], { cwd: FOLDER });
	});
});
