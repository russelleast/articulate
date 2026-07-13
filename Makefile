.PHONY: companion-poc-validate companion-poc-validate-placeholder companion-poc-render companion-poc-render-placeholder companion-poc-test

companion-poc-validate:
	node production/experiments/companion-poc-001/runtime/src/cli.mjs validate

companion-poc-validate-placeholder:
	node production/experiments/companion-poc-001/runtime/src/cli.mjs validate --placeholder-audio

companion-poc-render:
	node production/experiments/companion-poc-001/runtime/src/cli.mjs render

companion-poc-render-placeholder:
	node production/experiments/companion-poc-001/runtime/src/cli.mjs render --placeholder-audio

companion-poc-test:
	node --test production/experiments/companion-poc-001/runtime/tests/*.test.mjs
