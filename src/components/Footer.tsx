import { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Link from "@mui/material/Link"
import FooterCredits from "../features/view/FooterCredits"

const Footer = () => {
	const [expanded, setExpanded] = useState(false)
	return (
		<Box
			component='footer'
			sx={{
				textAlign: "center",
				paddingBottom: 2,
			}}
		>
			<Box
				sx={{
					mb: 1,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: 1,
				}}
			>
				<Typography variant='body2' color='textSecondary'>
					© 2025 Airship Design Calculator{"   "}
				</Typography>
				<Link
					component='button'
					variant='body2'
					onClick={() => setExpanded((prev) => !prev)}
				>
					{expanded ? "Hide License & Credits" : "License & Credits"}
				</Link>
			</Box>
			<FooterCredits expanded={expanded} />
		</Box>
	)
}

export default Footer
