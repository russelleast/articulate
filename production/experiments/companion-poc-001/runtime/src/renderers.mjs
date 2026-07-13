import path from "node:path";
import { writeCompanionFrame } from "./visuals.mjs";

export class CompanionRenderer {
  render() {
    throw new Error("CompanionRenderer.render must be implemented by an adapter");
  }
}

export class StaticCompanionRenderer extends CompanionRenderer {
  constructor({ config, repoRoot, generatedScenesDir }) {
    super();
    this.config = config;
    this.repoRoot = repoRoot;
    this.generatedScenesDir = generatedScenesDir;
  }

  render(scene) {
    const companionPath = path.join(this.repoRoot, this.config.assets.companionDesignSystem.path);
    const outputFrame = path.join(this.generatedScenesDir, `${scene.id}.svg`);
    writeCompanionFrame(outputFrame, this.config, scene, companionPath);
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
        companionAsset: this.config.assets.companionDesignSystem.path,
        crop: this.config.assets.companionDesignSystem.crop
      },
      warnings: [
        "Static reference-board crop only; not production avatar footage.",
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
