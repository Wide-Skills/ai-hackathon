import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  format: "esm",
  outDir: "./dist",
  clean: true,
  bundle: true,
  platform: "node",
  skipNodeModules: false, // ensure node_modules are bundled
  deps: {
    alwaysBundle: [/.*/], // bundle everything
  },
});
