import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
	base: process.env.NODE_ENV === "production" ? "./" : "./src/",
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
				entryFileNames: `assets/[name]-[hash].js`,
				chunkFileNames: `assets/[name]-[hash].js`,
				assetFileNames: `assets/[name]-[hash][extname]`,
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
