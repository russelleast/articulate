.PHONY: assets-validate assets-list companion-poc-validate companion-poc-validate-placeholder companion-poc-render companion-poc-render-placeholder companion-poc-render-real companion-poc-render-reference-fallback companion-poc-render-layout-debug companion-poc-test companion-performance-poc-analyse companion-performance-poc-validate companion-performance-poc-render episode-runtime-test episode-0000-analyse episode-0000-validate episode-0000-render episode-0000-review episode-0000-companion-performance-prepare episode-0000-companion-performance-validate episode-0000-companion-performance-render episode-0000-companion-performance-review episode-0000-final-cut-prepare episode-0000-final-cut-validate episode-0000-final-cut-render episode-0000-final-cut-review episode-0000-baseline-validate episode-0000-baseline-render episode-0000-baseline-review episode-0001-analyse episode-0001-validate episode-0001-render episode-0001-review episode-0001-rough-cut-03-prepare episode-0001-rough-cut-03-validate episode-0001-rough-cut-03-render episode-0001-rough-cut-03-review episode-0001-rough-cut-04-prepare episode-0001-rough-cut-04-validate episode-0001-rough-cut-04-render episode-0001-rough-cut-04-review

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

companion-performance-poc-analyse:
	node production/runtime/generate-companion-facial-assets.mjs
	node production/runtime/companion-performance-cli.mjs analyse --audio production/cache/episode-0000/companion-motion-lip-sync-poc-001/narration.wav --output production/experiments/companion-motion-lip-sync-poc-001/performance/lip-sync.json --source-start 161.686939
	node production/experiments/companion-motion-lip-sync-poc-001/generate-configs.mjs

companion-performance-poc-validate: companion-performance-poc-analyse
	node production/runtime/episode-cli.mjs validate --config production/experiments/companion-motion-lip-sync-poc-001/config/baseline.json
	node production/runtime/episode-cli.mjs validate --config production/experiments/companion-motion-lip-sync-poc-001/config/motion-only.resolved.json
	node production/runtime/episode-cli.mjs validate --config production/experiments/companion-motion-lip-sync-poc-001/config/motion-lip-sync.resolved.json

companion-performance-poc-render: companion-performance-poc-validate
	node production/runtime/episode-cli.mjs render --config production/experiments/companion-motion-lip-sync-poc-001/config/baseline.json
	node production/runtime/episode-cli.mjs render --config production/experiments/companion-motion-lip-sync-poc-001/config/motion-only.resolved.json
	node production/runtime/episode-cli.mjs render --config production/experiments/companion-motion-lip-sync-poc-001/config/motion-lip-sync.resolved.json

episode-runtime-test:
	node --test production/runtime/tests/*.test.mjs

episode-0000-analyse:
	node production/runtime/episode-cli.mjs analyse --config production/episodes/0000/production/episode-config.json

episode-0000-validate:
	node production/runtime/episode-cli.mjs validate --config production/episodes/0000/production/episode-config.json

episode-0000-render:
	node production/runtime/episode-cli.mjs render --config production/episodes/0000/production/episode-config.json

episode-0000-review:
	node production/runtime/episode-cli.mjs review --config production/episodes/0000/production/episode-config.json

episode-0000-companion-performance-prepare:
	node production/episodes/0000/production/prepare-companion-performance.mjs

episode-0000-companion-performance-validate: episode-0000-companion-performance-prepare
	node production/runtime/episode-cli.mjs validate --config production/episodes/0000/production/companion-performance-v1-config.json

episode-0000-companion-performance-render: episode-0000-companion-performance-validate
	node production/runtime/episode-cli.mjs render --config production/episodes/0000/production/companion-performance-v1-config.json

episode-0000-companion-performance-review:
	node production/runtime/episode-cli.mjs review --config production/episodes/0000/production/companion-performance-v1-config.json

episode-0000-final-cut-prepare:
	node production/episodes/0000/production/prepare-final-cut-candidate.mjs

episode-0000-final-cut-validate: episode-0000-final-cut-prepare
	node production/runtime/episode-cli.mjs validate --config production/episodes/0000/production/final-cut-candidate-v2-config.json

episode-0000-final-cut-render: episode-0000-final-cut-validate
	node production/runtime/episode-cli.mjs render --config production/episodes/0000/production/final-cut-candidate-v2-config.json

episode-0000-final-cut-review:
	node production/runtime/episode-cli.mjs review --config production/episodes/0000/production/final-cut-candidate-v2-config.json

episode-0000-baseline-validate:
	node production/runtime/episode-cli.mjs validate --config production/episodes/0000/production/baseline-config.json

episode-0000-baseline-render:
	node production/runtime/episode-cli.mjs render --config production/episodes/0000/production/baseline-config.json

episode-0000-baseline-review:
	node production/runtime/episode-cli.mjs review --config production/episodes/0000/production/baseline-config.json

episode-0001-analyse:
	node production/runtime/episode-cli.mjs analyse

episode-0001-validate:
	node production/runtime/episode-cli.mjs validate

episode-0001-render:
	node production/runtime/episode-cli.mjs render

episode-0001-review:
	node production/runtime/episode-cli.mjs review

episode-0001-rough-cut-03-prepare:
	node production/episodes/0001/production/prepare-rough-cut-03.mjs

episode-0001-rough-cut-03-validate: episode-0001-rough-cut-03-prepare
	node production/runtime/episode-cli.mjs validate --config production/episodes/0001/production/rough-cut-03-config.json

episode-0001-rough-cut-03-render: episode-0001-rough-cut-03-validate
	node production/runtime/episode-cli.mjs render --config production/episodes/0001/production/rough-cut-03-config.json

episode-0001-rough-cut-03-review:
	node production/runtime/episode-cli.mjs review --config production/episodes/0001/production/rough-cut-03-config.json

episode-0001-rough-cut-04-prepare:
	node production/episodes/0001/production/prepare-rough-cut-04.mjs

episode-0001-rough-cut-04-validate: episode-0001-rough-cut-04-prepare
	node production/episodes/0001/production/validate-rough-cut-04.mjs
	node production/runtime/episode-cli.mjs validate --config production/episodes/0001/production/rough-cut-04-config.json

episode-0001-rough-cut-04-render: episode-0001-rough-cut-04-validate
	node production/runtime/episode-cli.mjs render --config production/episodes/0001/production/rough-cut-04-config.json

episode-0001-rough-cut-04-review:
	node production/runtime/episode-cli.mjs review --config production/episodes/0001/production/rough-cut-04-config.json
