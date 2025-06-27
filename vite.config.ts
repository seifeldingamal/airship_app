import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": "/src",
		},
	},
	optimizeDeps: {
		include: ["@react-three/fiber", "@react-three/drei"],
		exclude: ["three"],
	},
	build: {
		target: "esnext",
		outDir: "dist",
		rollupOptions: {
			output: {
				manualChunks: {
					three: ["three"],
					mui: ["@mui/material"],
					vendor: ["react", "react-dom"],
				},
			},
		},
		chunkSizeWarningLimit: 1000,
	},
})
