module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				airship: {
					primary: "#3b82f6",
					secondary: "#10b981",
					accent: "#8b5cf6",
				},
			},
			fontFamily: {
				sans: ["Poppins", "sans-serif"],
			},
		},
	},
	plugins: [],
}
