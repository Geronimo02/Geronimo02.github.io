import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "portfolio-booking-api",
    entrypoint: "./src/index.js",
    compatibilityDate: "2026-10-26",
  },
});
