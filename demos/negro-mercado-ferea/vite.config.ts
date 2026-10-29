import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: process.env.CLOUDFLARE_VITE_FORCE_BUILD_OUTPUT === "true" ? [cloudflare()] : [],
});
