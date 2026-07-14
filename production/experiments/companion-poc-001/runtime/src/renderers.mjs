import path from "node:path";
import { writeCompanionFrame } from "./visuals.mjs";

export class CompanionRenderer {
  render() {
    throw new Error("CompanionRenderer.render must be implemented by an adapter");
  }
}

export class StaticCompanionRenderer extends CompanionRenderer {
  constructor({ config, assetManager, generatedScenesDir, companionAsset = null, layoutDebug = false }) {
    super();
    this.config = config;
    this.assetManager = assetManager;
    this.generatedScenesDir = generatedScenesDir;
    this.companionAsset = companionAsset;
    this.layoutDebug = layoutDebug;
  }

  render(scene) {
    const companionId = this.config.assets.companionNeutral.assetId;
    const resolvedCompanionId = this.companionAsset?.assetId ?? companionId;
    const companionPath = this.companionAsset?.source === "reference-sheet-fallback"
      ? this.companionAsset.path
      : this.assetManager.fetch(resolvedCompanionId);
    const outputFrame = path.join(this.generatedScenesDir, `${scene.id}.svg`);
    writeCompanionFrame(outputFrame, this.config, scene, companionPath, {
      debug: this.layoutDebug,
      companionAsset: this.companionAsset
    });
    return {
      sceneId: scene.id,
      renderer: "StaticCompanionRenderer",
      renderedVideo: null,
      frame: outputFrame,
      durationSeconds: scene.durationSeconds,
      resolution: {
        width: this.config.output.width,
        height: this.config.output.height
      },
      audioStatus: "not-rendered-by-companion-adapter",
      lipSync: "absent",
      provenance: {
        companionAsset: resolvedCompanionId,
        source: this.companionAsset?.source ?? "standalone",
        crop: this.companionAsset?.crop ?? null,
        dimensions: this.companionAsset?.dimensions ?? null
      },
      warnings: [
        ...(this.companionAsset?.warnings ?? []),
        "No lip-sync or mouth animation is produced by this fallback."
      ]
    };
  }
}

export class MockCompanionRenderer extends CompanionRenderer {
  render(scene) {
    return {
      sceneId: scene.id,
      renderer: "MockCompanionRenderer",
      renderedVideo: "mock.mp4",
      durationSeconds: scene.durationSeconds,
      resolution: { width: 1920, height: 1080 },
      audioStatus: "mocked",
      lipSync: "mocked",
      provenance: { test: true },
      warnings: []
    };
  }
}
