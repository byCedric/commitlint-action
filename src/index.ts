import * as core from '@actions/core';
import * as commitlint from './commitlint';
import * as context from './context';

async function run() {
	const cli = await commitlint.install();
	const config = {
		...context.config(),
		...context.range(),
	};

	core.debug(`Commitlint ready to use!\n\t${cli}\n\t${JSON.stringify(config, null, 2)}`);
	await commitlint.run(cli, config);
}

run().catch(
	error => core.setFailed(error.message)
);
