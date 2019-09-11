import * as context from '../src/context';

describe('config', () => {
	test('uses undefined by default', () => {
		expect(context.config()).toMatchObject({ config: undefined, extends: undefined });
	});

	test('uses config input', () => {
		process.env['INPUT_CONFIG'] = '/path/to/config';
		expect(context.config()).toMatchObject({ config: '/path/to/config' });
		process.env['INPUT_CONFIG'] = '';
	});

	test('uses extends input', () => {
		process.env['INPUT_EXTENDS'] = '@commitlint/config-conventional';
		expect(context.config()).toMatchObject({ extends: '@commitlint/config-conventional' });
		process.env['INPUT_EXTENDS'] = '';
	});
});

describe('range', () => {
	test('uses fallback by default', () => {
		expect(context.range()).toMatchObject({ from: undefined, to: 'HEAD' });
	});

	describe('user provided input', () => {
		afterEach(() => {
			process.env['INPUT_FROM'] = '';
			process.env['INPUT_TO'] = '';
		});

		test('uses input parameters "from" and "to"', () => {
			process.env['INPUT_FROM'] = 'from';
			process.env['INPUT_TO'] = 'to';
			expect(context.range()).toMatchObject({ from: 'from', to: 'to' });
		});

		test('uses only input parameter "from"', () => {
			process.env['INPUT_FROM'] = 'from';
			expect(context.range()).toMatchObject({ from: 'from', to: undefined });
		});

		test('uses only input parameter "to"', () => {
			process.env['INPUT_TO'] = 'to';
			expect(context.range()).toMatchObject({ from: undefined, to: 'to' });
		});
	});

	describe('github pull request', () => {
		afterEach(() => {
			process.env['GITHUB_HEAD_REF'] = '';
			process.env['GITHUB_BASE_REF'] = '';
		});

		test('uses reference "GITHUB_HEAD_REF" and "GITHUB_BASE_REF"', () => {
			process.env['GITHUB_HEAD_REF'] = 'from';
			process.env['GITHUB_BASE_REF'] = 'to';
			expect(context.range()).toMatchObject({ from: 'from', to: 'to' });
		});

		test('uses only input parameter "from"', () => {
			process.env['GITHUB_HEAD_REF'] = 'from';
			process.env['GITHUB_BASE_REF'] = '';
			expect(context.range()).toMatchObject({ from: 'from', to: undefined });
		});

		test('uses only input parameter "to"', () => {
			process.env['GITHUB_HEAD_REF'] = '';
			process.env['GITHUB_BASE_REF'] = 'to';
			expect(context.range()).toMatchObject({ from: undefined, to: 'to' });
		});
	});

	describe('github commit', () => {
		test('uses "GITHUB_SHA"', () => {
			process.env['GITHUB_SHA'] = 'commit';
			expect(context.range()).toMatchObject({ from: undefined, to: 'commit', });
			process.env['GITHUB_SHA'] = '';
		});

		test('uses "GITHUB_REF"', () => {
			process.env['GITHUB_REF'] = 'branch';
			expect(context.range()).toMatchObject({ from: undefined, to: 'branch' });
			process.env['GITHUB_REF'] = '';
		});
	});
});
