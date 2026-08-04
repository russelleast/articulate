.PHONY: assets-validate assets-list companion-poc-validate companion-poc-validate-placeholder companion-poc-render companion-poc-render-placeholder companion-poc-render-real companion-poc-render-reference-fallback companion-poc-render-layout-debug companion-poc-test companion-performance-poc-analyse companion-performance-poc-validate companion-performance-poc-render episode-production-segments episode-production-validate episode-runtime-test episode-0000-analyse episode-0000-validate episode-0000-render episode-0000-review episode-0000-presenter-prepare episode-0000-presenter-analyse episode-0000-presenter-validate episode-0000-presenter-render episode-0000-presenter-review episode-0000-thumbnail episode-0000-companion-performance-prepare episode-0000-companion-performance-validate episode-0000-companion-performance-render episode-0000-companion-performance-review episode-0000-final-cut-prepare episode-0000-final-cut-validate episode-0000-final-cut-render episode-0000-final-cut-review episode-0000-baseline-validate episode-0000-baseline-render episode-0000-baseline-review episode-0001-analyse episode-0001-validate episode-0001-render episode-0001-review episode-0001-presenter-prepare episode-0001-presenter-analyse episode-0001-presenter-validate episode-0001-presenter-render episode-0001-presenter-review episode-0001-thumbnail episode-0001-rough-cut-03-prepare episode-0001-rough-cut-03-validate episode-0001-rough-cut-03-render episode-0001-rough-cut-03-review episode-0001-rough-cut-04-prepare episode-0001-rough-cut-04-validate episode-0001-rough-cut-04-render episode-0001-rough-cut-04-review episode-0002-presenter-prepare episode-0002-presenter-analyse episode-0002-presenter-validate episode-0002-presenter-render episode-0002-presenter-review episode-0002-final-cut-render episode-0002-thumbnail episode-0003-presenter-prepare episode-0003-presenter-analyse episode-0003-presenter-validate episode-0003-presenter-render episode-0003-presenter-review episode-0003-thumbnail episode-0004-presenter-prepare episode-0004-presenter-analyse episode-0004-presenter-validate episode-0004-presenter-render episode-0004-presenter-review episode-0004-thumbnail

.PHONY: diagrams-validate diagrams-render diagram-render pre-render-inspect pre-render-transcript pre-render-align pre-render-plan-validate pre-render-timeline pre-render-validate

diagrams-validate:
	node production/runtime/diagrams-cli.mjs validate

diagrams-render:
	node production/runtime/diagrams-cli.mjs render

diagram-render:
	@test -n "$(DIAGRAM)" || (echo "DIAGRAM is required (for example: make diagram-render DIAGRAM=knowledge-reasoning-flow)" && exit 2)
	node production/runtime/diagrams-cli.mjs render $(DIAGRAM)

pre-render-inspect:
	@test -n "$(EPISODE)" || (echo "EPISODE is required (for example: EPISODE=0004)" && exit 2)
	node production/runtime/pre-render-cli.mjs inspect-sources --episode $(EPISODE)

pre-render-transcript:
	@test -n "$(EPISODE)" || (echo "EPISODE is required (for example: EPISODE=0004)" && exit 2)
	@test -n "$(RAW)" || (echo "RAW is required (timestamped Whisper JSON)" && exit 2)
	node production/runtime/pre-render-cli.mjs normalise-transcript --episode $(EPISODE) --raw $(RAW) $(if $(FORCE),--force)

pre-render-align:
	@test -n "$(EPISODE)" || (echo "EPISODE is required (for example: EPISODE=0004)" && exit 2)
	node production/runtime/pre-render-cli.mjs align-sources --episode $(EPISODE) $(if $(FORCE),--force)

pre-render-plan-validate:
	@test -n "$(EPISODE)" || (echo "EPISODE is required (for example: EPISODE=0004)" && exit 2)
	node production/runtime/pre-render-cli.mjs validate-plan --episode $(EPISODE)

pre-render-timeline:
	@test -n "$(EPISODE)" || (echo "EPISODE is required (for example: EPISODE=0004)" && exit 2)
	node production/runtime/pre-render-cli.mjs generate-timeline --episode $(EPISODE) $(if $(ALLOW_DRAFT),--allow-draft) $(if $(FORCE),--force)

pre-render-validate:
	@test -n "$(EPISODE)" || (echo "EPISODE is required (for example: EPISODE=0004)" && exit 2)
	node production/runtime/pre-render-cli.mjs validate --episode $(EPISODE)

assets-validate:
	node production/runtime/assets-cli.mjs validate

assets-list:
	node production/runtime/assets-cli.mjs list

episode-production-segments:
	@test -n "$(EPISODE)" || (echo "EPISODE is required (for example: EPISODE=0003)" && exit 2)
	@test -n "$(JOURNAL)" || (echo "JOURNAL is required (for example: JOURNAL=docs/episodes/0003-why-ai-native-systems.md)" && exit 2)
	node production/runtime/episode-production-cli.mjs segments --episode $(EPISODE) --journal $(JOURNAL)

episode-production-validate:
	@test -n "$(EPISODE)" || (echo "EPISODE is required (for example: EPISODE=0003)" && exit 2)
	@test -n "$(JOURNAL)" || (echo "JOURNAL is required (for example: JOURNAL=docs/episodes/0003-why-ai-native-systems.md)" && exit 2)
	node production/runtime/episode-production-cli.mjs validate --episode $(EPISODE) --journal $(JOURNAL)

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

episode-0000-presenter-analyse: episode-0000-analyse

episode-0000-presenter-prepare:
	node production/episodes/0000/production/prepare-presenter-rough-cut.mjs

episode-0000-presenter-validate: episode-0000-presenter-prepare episode-0000-validate
	node production/episodes/0000/production/validate-presenter-rough-cut.mjs

episode-0000-presenter-render: episode-0000-presenter-prepare episode-0000-render

episode-0000-presenter-review: episode-0000-review

episode-0000-thumbnail:
	node production/episodes/0000/publication/thumbnail/render-presenter-thumbnail.mjs

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

episode-0001-presenter-prepare:
	node production/episodes/0001/production/prepare-presenter-refresh.mjs

episode-0001-presenter-analyse: episode-0001-presenter-prepare
	node production/runtime/episode-cli.mjs analyse --config production/episodes/0001/production/presenter-refresh-config.json

episode-0001-presenter-validate: episode-0001-presenter-prepare
	node production/runtime/episode-cli.mjs validate --config production/episodes/0001/production/presenter-refresh-config.json

episode-0001-presenter-render: episode-0001-presenter-validate
	node production/runtime/episode-cli.mjs render --config production/episodes/0001/production/presenter-refresh-config.json
	node production/episodes/0001/production/validate-presenter-refresh.mjs

episode-0001-presenter-review:
	node production/runtime/episode-cli.mjs review --config production/episodes/0001/production/presenter-refresh-config.json

episode-0001-thumbnail:
	node production/episodes/0001/publication/thumbnail/render-presenter-thumbnail.mjs

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

episode-0002-presenter-prepare:
	node production/runtime/diagrams-cli.mjs render architectural-understanding
	node production/runtime/diagrams-cli.mjs render knowledge-as-primary-asset
	node production/runtime/diagrams-cli.mjs render conversation-knowledge-interface
	node production/episodes/0002/production/prepare-presenter-v1.mjs

episode-0002-presenter-analyse: episode-0002-presenter-prepare
	node production/runtime/episode-cli.mjs analyse --config production/episodes/0002/production/presenter-v1-config.json

episode-0002-presenter-validate: episode-0002-presenter-prepare
	node production/runtime/episode-cli.mjs validate --config production/episodes/0002/production/presenter-v1-config.json

episode-0002-presenter-render: episode-0002-presenter-validate
	node production/runtime/episode-cli.mjs render --config production/episodes/0002/production/presenter-v1-config.json
	node production/episodes/0002/publication/thumbnail/render-thumbnail.mjs
	node production/episodes/0002/production/validate-presenter-v1.mjs

episode-0002-presenter-review:
	node production/runtime/episode-cli.mjs review --config production/episodes/0002/production/presenter-v1-config.json

episode-0002-final-cut-render: episode-0002-presenter-render

episode-0002-thumbnail:
	node production/episodes/0002/publication/thumbnail/render-thumbnail.mjs

episode-0003-presenter-prepare:
	node production/runtime/diagrams-cli.mjs render episode-0003-problem-to-technology
	node production/runtime/diagrams-cli.mjs render episode-0003-deterministic-or-intelligent
	node production/runtime/diagrams-cli.mjs render episode-0003-intelligent-responsibilities
	node production/runtime/diagrams-cli.mjs render episode-0003-intelligence-runtime-capability
	node production/episodes/0003/production/prepare-presenter-v2.mjs

episode-0003-presenter-analyse: episode-0003-presenter-prepare
	node production/runtime/episode-cli.mjs analyse --config production/episodes/0003/production/presenter-v2-config.json

episode-0003-presenter-validate: episode-0003-presenter-prepare
	node production/runtime/episode-cli.mjs validate --config production/episodes/0003/production/presenter-v2-config.json

episode-0003-presenter-render: episode-0003-presenter-validate
	node production/runtime/episode-cli.mjs render --config production/episodes/0003/production/presenter-v2-config.json
	node production/episodes/0003/production/validate-presenter-v2.mjs

episode-0003-presenter-review:
	node production/runtime/episode-cli.mjs review --config production/episodes/0003/production/presenter-v2-config.json

episode-0003-thumbnail:
	node production/episodes/0003/publication/thumbnail/render-thumbnail.mjs

episode-0004-presenter-prepare:
	node production/runtime/diagrams-cli.mjs render
	node production/episodes/0004/production/prepare-presenter-v1.mjs

episode-0004-presenter-analyse: episode-0004-presenter-prepare
	node production/runtime/episode-cli.mjs analyse --config production/episodes/0004/episode.json

episode-0004-presenter-validate: episode-0004-presenter-prepare
	node production/runtime/episode-cli.mjs validate --config production/episodes/0004/episode.json

episode-0004-presenter-render: episode-0004-presenter-validate
	node production/runtime/episode-cli.mjs render --config production/episodes/0004/episode.json

episode-0004-presenter-review:
	node production/runtime/episode-cli.mjs review --config production/episodes/0004/episode.json

episode-0004-thumbnail:
	node production/episodes/0004/publication/thumbnail/render-thumbnail.mjs
