import { defineConfig } from "cf/config";

export default defineConfig({
  accountId: "61bdba5d14428f5eda1ad2e527109064",
  worker: {
    "name": "negro-mercado-tandil",
    "compatibilityDate": "2026-10-24",
    "observability": {
      "enabled": true,
      "traces": { "enabled": true }
    },
    "assets": {
      "notFoundHandling": "single-page-application"
    }
  }
});
