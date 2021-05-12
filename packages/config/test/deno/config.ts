import { loadConfig, searchConfig, ValidationError } from "../../mod.ts";
import { path, expect } from "@test/deps.ts";

const fixturePath = path.join(
  path.fromFileUrl(import.meta.url),
  "../../../__fixtures__"
);

describe("@kosko/config loadConfig", () => {
  describe("when file exists", () => {
    it("should load the config", async () => {
      const config = await loadConfig(
        path.join(fixturePath, "toml", "kosko.toml")
      );

      expect(config).to.deep.equal({
        require: ["a"],
        components: ["b", "c"],
        extensions: ["js", "json"],
        baseEnvironment: "m",
        environments: {
          dev: { require: ["d", "e"], components: ["f", "g"] },
          prod: { require: ["h"], components: ["i", "j"] }
        },
        paths: { environment: { global: "k", component: "l" } }
      });
    });
  });

  describe("when file does not exist", () => {
    it("should throw an error", async () => {
      await expect(loadConfig(path.join(fixturePath, "nowhere"))).to.be
        .rejected;
    });
  });

  describe("when config is invalid", () => {
    it("should throw ValidationError", async () => {
      await expect(
        loadConfig(path.join(fixturePath, "invalid", "kosko.toml"))
      ).to.be.rejectedWith(ValidationError);
    });
  });
});

describe("@kosko/config searchConfig", () => {
  describe("when config is at kosko.toml", () => {
    it("should load the config", async () => {
      const config = await searchConfig(path.join(fixturePath, "toml"));

      expect(config).to.deep.equal({
        require: ["a"],
        components: ["b", "c"],
        extensions: ["js", "json"],
        baseEnvironment: "m",
        environments: {
          dev: { require: ["d", "e"], components: ["f", "g"] },
          prod: { require: ["h"], components: ["i", "j"] }
        },
        paths: { environment: { global: "k", component: "l" } }
      });
    });
  });

  describe("when config not found", () => {
    it("should return an empty object", async () => {
      const config = await searchConfig(fixturePath);

      expect(config).to.deep.equal({});
    });
  });

  describe("when config is invalid", () => {
    it("should throw ValidationError", async () => {
      await expect(
        searchConfig(path.join(fixturePath, "invalid"))
      ).to.be.rejectedWith(ValidationError);
    });
  });
});
