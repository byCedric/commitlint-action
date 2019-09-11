const core = { setFailed: jest.fn() };
const commitlint = { install: jest.fn(), run: jest.fn() };
const context = { config: jest.fn(), range: jest.fn() };

jest.mock('@actions/core', () => core);
jest.mock('../src/commitlint', () => commitlint);
jest.mock('../src/context', () => context);

import { run } from '../src/index';

describe('run', () => {
	test('combines all configuration', async () => {
		context.config.mockReturnValueOnce({ config: '/path/to/config' });
		context.range.mockReturnValueOnce({ from: 'target', to: 'source' });
		await run();
		expect(commitlint.run).toBeCalledWith(undefined, {
			config: '/path/to/config',
			from: 'target',
			to: 'source',
		});
	});

	test('performs commitlint installation', async () => {
		await run();
		expect(commitlint.install).toBeCalled();
	});

	test('performs commitlint run', async () => {
		commitlint.install.mockResolvedValue('/path/to/commitlint');
		await run();
		expect(commitlint.run).toBeCalledWith('/path/to/commitlint', {});
	});

	test('fails action for errors', async () => {
		const error = new Error('Something went wrong during installation');
		commitlint.install.mockRejectedValue(error);
		await run();
		expect(core.setFailed).toBeCalledWith(error.message);
	});
});
