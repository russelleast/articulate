.PHONY: assets-validate assets-list companion-poc-validate companion-poc-validate-placeholder companion-poc-render companion-poc-render-placeholder companion-poc-render-real companion-poc-render-reference-fallback companion-poc-render-layout-debug companion-poc-test episode-0001-analyse episode-0001-validate episode-0001-render episode-0001-review

assets-validate:
	node production/runtime/assets-cli.mjs validate

assets-list:
	node production/runtime/assets-cli.mjs list

companion-poc-validate:
	node production/experiments/companion-poc-001/runtime/src/cli.mjs validate

companion-poc-validate-placeholder:
	node production/experiments/companion-poc-001/runtime/src/cli.mjs validate --placeholder-audio

companion-poc-render:
	node production/experiments/companion-poc-001/runtime/src/cli.mjs render

companion-poc-render-placeholder:
	node production/experiments/companion-poc-001/runtime/src/cli.mjs render --placeholder-audio

companion-poc-render-real:
	node production/experiments/companion-poc-001/runtime/src/cli.mjs render-real

companion-poc-render-reference-fallback:
	node production/experiments/companion-poc-001/runtime/src/cli.mjs render-reference-fallback

companion-poc-render-layout-debug:
	node production/experiments/companion-poc-001/runtime/src/cli.mjs render-layout-debug

companion-poc-test:
	node --test production/experiments/companion-poc-001/runtime/tests/*.test.mjs

episode-0001-analyse:
	node production/runtime/episode-cli.mjs analyse

episode-0001-validate:
	node production/runtime/episode-cli.mjs validate

episode-0001-render:
	node production/runtime/episode-cli.mjs render

episode-0001-review:
	node production/runtime/episode-cli.mjs review
