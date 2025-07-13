import { Box, Button } from "@mui/material"
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded"

const RedirectComponent = () => {
	const urlParams = new URLSearchParams(window.location.search)
	const redirectUrl = urlParams.get("url")

	const isValidUrl = (url: string) => {
		try {
			new URL(url)
			return true
		} catch {
			return false
		}
	}

	const handleRedirect = () => {
		if (redirectUrl && isValidUrl(redirectUrl)) {
			window.location.href = redirectUrl
		}
	}

	// Only render if there's a valid URL
	if (!redirectUrl || !isValidUrl(redirectUrl)) {
		return null
	}

	return (
		<Box mt={3}>
			<Button
				variant='outlined'
				color='primary'
				size='large'
				onClick={handleRedirect}
				startIcon={<KeyboardBackspaceRoundedIcon />}
				sx={{ borderRadius: 2, fontWeight: "bold" }}
			>
				Return
			</Button>
		</Box>
	)
}

export default RedirectComponent
