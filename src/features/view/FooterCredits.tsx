import { useRef } from "react"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import Collapse from "@mui/material/Collapse"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Link from "@mui/material/Link"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

interface FooterCreditsProps {
	expanded: boolean
}

const FooterCredits: React.FC<FooterCreditsProps> = ({ expanded }) => {
	const cardRef = useRef<HTMLDivElement | null>(null)

	const handleEntered = () => {
		if (cardRef.current) {
			cardRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
			})
		}
	}

	return (
		<Collapse
			in={expanded}
			timeout='auto'
			unmountOnExit
			onEntered={handleEntered}
		>
			<Card
				ref={cardRef}
				sx={{
					bgcolor: "white",
					p: 3,
					borderRadius: 3,
					boxShadow: 3,
					mt: 2,
					textAlign: "center",
					width: "100%",
					maxWidth: "1000px",
					mx: "auto",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Typography variant='subtitle1' gutterBottom>
					Airship Design Calculator
				</Typography>
				<Typography variant='body2' paragraph>
					Based on Gertler 4621 Shape spreadsheet. Computes shape,
					volume, center of volume, and patterns for Series58 Model
					4621 body.
				</Typography>
				<Accordion
					sx={{
						backgroundColor: "transparent",
						borderRadius: 2,
						mb: 2,
						width: "100%",
					}}
				>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant='body2'>License</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Typography variant='body2' paragraph>
							<Link
								href='https://www.gnu.org/licenses/gpl.html'
								target='_blank'
								rel='noopener noreferrer'
							>
								GPL
							</Link>
						</Typography>
						<Typography variant='body2' paragraph>
							This program is free software: you can redistribute
							it and/or modify it under the terms of the GNU
							General Public License as published by the Free
							Software Foundation.
						</Typography>
						<Typography variant='body2'>
							Source spreadsheet and methodology courtesy of
							Gertler.
						</Typography>
					</AccordionDetails>
				</Accordion>
				<Accordion
					sx={{
						backgroundColor: "transparent",
						borderRadius: 2,
						width: "100%",
					}}
				>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant='body2'>
							View Contributors &amp; History
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Typography
							variant='body2'
							component='div'
							align='left'
						>
							<ul>
								<li>Gertler 4621 Shape</li>
								<li>Johannes Eissing, 11.02.2008</li>
								<li>Martin Zobel, 21.10.2009</li>
								<li>Johannes Eissing, 23.10.2009</li>
								<li>Johannes Eissing, 19.11.2019</li>
								<li>
									Johannes Eissing, 2016/11/32, added General
									Public License Agreement.
								</li>
								<li>
									Johannes Eissing, 25/11/2019, added
									coefficient generator.
								</li>
								<li>
									Seifeldin Abouelella, 15/07/2025, created
									this web application.
								</li>
							</ul>
						</Typography>
					</AccordionDetails>
				</Accordion>
			</Card>
		</Collapse>
	)
}

export default FooterCredits
