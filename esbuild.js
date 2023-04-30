import * as esbuild from "esbuild";
import { copy } from "esbuild-plugin-copy";

esbuild.build({
  entryPoints: ["./server/main.ts"],
  tsconfig: "tsconfig.server.json",
  bundle: true,
  minify: true,
  platform: "node",
  outfile: "dist/server.cjs",
  external: ["pg-native", "pg-hstore"],
  logLevel: "info",
  plugins: [
    copy({
      // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
      // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
      resolveFrom: "cwd",
      assets: {
        from: ["./assets/default/*"],
        to: ["./dist/assets/default"],
      },
      watch: true,
    }),
  ],
});
