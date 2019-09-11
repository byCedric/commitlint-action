import * as core from '@actions/core';
import * as commitlint from './commitlint';
import * as context from './context';

export async function run() {
	const config = {
		...context.config(),
		...context.range(),
	};

	try {
		await commitlint.run(
			await commitlint.install(),
			config
		);
	} catch (error) {
		core.setFailed(error.message);
	}
}

run();
